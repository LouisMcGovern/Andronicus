/**
 * Vercel serverless function: POST /api/send-progress-emails
 *
 * Required environment variables (set in Vercel Project Settings):
 *   SUPABASE_SERVICE_ROLE_KEY   — service role key (bypasses RLS)
 *   ANDRONICUS_SUPABASE_URL     — your Supabase project URL (already used for config.local.js)
 *   ANDRONICUS_ADMIN_API_SECRET — must match the value sent by the admin frontend
 *   RESEND_API_KEY              — from https://resend.com
 *
 * The request body must contain { secret: "<ANDRONICUS_ADMIN_API_SECRET>" }
 * so only the admin can trigger sends.
 */

const CONTENT_LEVELS = ["beginner", "intermediate", "advanced"];
const LEVEL_LABELS = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

const FR_MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

function buildSubject(parentName, fullName) {
  const now = new Date();
  const month = FR_MONTHS[now.getMonth()];
  const year = now.getFullYear();
  // Prefer parent name for subject personalisation; fall back to student name
  const name = (parentName || fullName || "").trim().split(/\s+/)[0] || "Famille";
  return `Andronicus – Résultats de ${month} ${year} | ${name}`;
}

function isEmail(str) {
  return typeof str === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
}

function getStudentLevel(lh) {
  const l = (lh && lh.lastLevel) || "";
  return CONTENT_LEVELS.includes(l) ? l : null;
}

function homeworkDoneCount(lh, level) {
  if (!lh || !lh.homeworkChecklist || !level) return 0;
  const done = lh.homeworkChecklist[level];
  if (!done || typeof done !== "object") return 0;
  return Object.values(done).filter(Boolean).length;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildCourseProgressHtml() {
  const TOTAL_MONTHS = 10;
  // September 2026 = month 1, June 2027 = month 10
  const PROGRAMME_START = new Date(2026, 8, 1);  // 1 Sep 2026
  const PROGRAMME_END   = new Date(2027, 5, 30); // 30 Jun 2027

  const now = new Date();

  if (now < PROGRAMME_START) {
    return `<div class="course-progress">
  <p class="course-progress__label">Programme starts 1 September 2026 — see you then!</p>
</div>`;
  }

  if (now > PROGRAMME_END) {
    return `<div class="course-progress">
  <p class="course-progress__label">Programme completed — congratulations! 🎉</p>
</div>`;
  }

  // Month 1 = Sep 2026 (year=2026, month=8 in JS)
  const startYear = 2026, startMonth = 8;
  const monthIndex = (now.getFullYear() - startYear) * 12 + (now.getMonth() - startMonth);
  const currentMonth = Math.min(Math.max(monthIndex + 1, 1), TOTAL_MONTHS);

  const filled = "█".repeat(currentMonth);
  const empty  = "░".repeat(TOTAL_MONTHS - currentMonth);
  const bar    = filled + empty;

  let motivation;
  if (currentMonth <= 3) {
    motivation = "Great start — you're building your foundations!";
  } else if (currentMonth <= 6) {
    motivation = "You're halfway there — keep the momentum going!";
  } else if (currentMonth <= 9) {
    motivation = "The finish line is in sight — push through!";
  } else {
    motivation = "Final month — give it everything!";
  }

  return `<div class="course-progress">
  <p class="course-progress__heading">Course progress</p>
  <p class="course-progress__bar">${bar} <strong>Month ${currentMonth} of ${TOTAL_MONTHS}</strong></p>
  <p class="course-progress__motivation">${motivation}</p>
</div>`;
}

function buildEmailHtml(fullName, username, stats, parentName) {
  const lh = (stats && stats.learningHub) || {};
  const level = getStudentLevel(lh);
  const levelLabel = level ? LEVEL_LABELS[level] : "—";

  const flashAtt = (stats && stats.flashcards && stats.flashcards.attempts) || 0;
  const flashCor = (stats && stats.flashcards && stats.flashcards.correct) || 0;
  const flashPct = flashAtt ? Math.round((flashCor / flashAtt) * 100) : 0;

  const quizSessions = (stats && stats.quizSessions) || 0;
  const exercisesDone = (stats && stats.completedExercises && stats.completedExercises.length) || 0;
  const hwDone = homeworkDoneCount(lh, level);

  const displayName = fullName || username;
  const greeting = parentName ? escapeHtml(parentName.trim().split(/\s+/)[0]) : null;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your Andronicus progress summary</title>
<style>
  body { font-family: Georgia, serif; background: #f4f6fb; margin: 0; padding: 24px; color: #1a1a2e; }
  .card { background: #ffffff; border-radius: 12px; max-width: 540px; margin: 0 auto; padding: 36px 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  h1 { font-size: 22px; margin: 0 0 4px; color: #1d3a6e; }
  .level-badge { display: inline-block; background: #1d4ed8; color: #fff; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 3px 10px; border-radius: 999px; margin-left: 8px; vertical-align: middle; }
  .level-badge.beginner { background: #059669; }
  .level-badge.intermediate { background: #1d4ed8; }
  .level-badge.advanced { background: #7c3aed; }
  .sub { color: #6b7280; font-size: 14px; margin: 4px 0 28px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th { text-align: left; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: #9ca3af; padding: 0 0 8px; border-bottom: 1px solid #e5e7eb; }
  td { padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 15px; }
  td:last-child { text-align: right; font-weight: 700; color: #1d3a6e; }
  .footer { font-size: 12px; color: #9ca3af; margin-top: 28px; }
  a { color: #1d4ed8; }
  .course-progress { background: #f0f4ff; border-radius: 8px; padding: 14px 18px; margin: 0 0 24px; }
  .course-progress__heading { margin: 0 0 6px; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: #9ca3af; font-family: Arial, sans-serif; }
  .course-progress__bar { margin: 0 0 6px; font-family: monospace; font-size: 15px; color: #1d4ed8; letter-spacing: 1px; }
  .course-progress__motivation { margin: 0; font-size: 13px; color: #374151; font-style: italic; }
  .course-progress__label { margin: 0; font-size: 14px; color: #374151; font-style: italic; }
</style>
</head>
<body>
<div class="card">
  <h1>
    Bonjour ${greeting ? greeting : escapeHtml(displayName)} !
    ${level ? `<span class="level-badge ${level}">${escapeHtml(levelLabel)}</span>` : ""}
  </h1>
  <p class="sub">Voici le résumé de progression d'Andronicus pour ${escapeHtml(fullName || username)}.</p>
  ${buildCourseProgressHtml()}
  <table>
    <thead>
      <tr>
        <th>Activity</th>
        <th>Result</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Flashcard cards reviewed</td>
        <td>${flashAtt}</td>
      </tr>
      <tr>
        <td>Flashcard accuracy</td>
        <td>${flashPct}%</td>
      </tr>
      <tr>
        <td>Vocabulary quiz sessions</td>
        <td>${quizSessions}</td>
      </tr>
      <tr>
        <td>Grammar exercises completed</td>
        <td>${exercisesDone}</td>
      </tr>
      <tr>
        <td>Homework tasks ticked off</td>
        <td>${hwDone}</td>
      </tr>
    </tbody>
  </table>
  <p>Keep it up — see you at the next class!</p>
  <p class="footer">
    Andronicus · English grinds for French-speaking students ·
    <a href="https://andronicus-two.vercel.app/">andronicus-two.vercel.app</a>
  </p>
</div>
</body>
</html>`;
}

async function fetchAllStudents(supabaseUrl, serviceRoleKey) {
  const url = `${supabaseUrl}/rest/v1/student_accounts?select=username,full_name,parent_email,stats`;
  const res = await fetch(url, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase fetch failed (${res.status}): ${text}`);
  }
  return res.json();
}

async function sendEmail(resendApiKey, to, subject, html) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Andronicus <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend error (${res.status}): ${text}`);
  }
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const adminSecret = process.env.ANDRONICUS_ADMIN_API_SECRET || "";
  const supabaseUrl = (process.env.ANDRONICUS_SUPABASE_URL || "").replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const resendApiKey = process.env.RESEND_API_KEY || "";

  if (!adminSecret || !supabaseUrl || !serviceRoleKey || !resendApiKey) {
    return res.status(500).json({
      error:
        "Server misconfigured. Ensure ANDRONICUS_ADMIN_API_SECRET, ANDRONICUS_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and RESEND_API_KEY are set in Vercel.",
    });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  if (!body || body.secret !== adminSecret) {
    return res.status(401).json({ error: "Unauthorised" });
  }

  let students;
  try {
    students = await fetchAllStudents(supabaseUrl, serviceRoleKey);
  } catch (err) {
    return res.status(502).json({ error: "Failed to fetch students: " + err.message });
  }

  const results = { sent: [], skipped: [], errors: [] };

  for (const student of students) {
    const parentEmail = (student.parent_email || "").trim();
    if (!isEmail(parentEmail)) {
      console.warn(`[send-progress-emails] Skipping ${student.username} — no valid parent_email`);
      results.skipped.push(student.username);
      continue;
    }
    const stats = student.stats || {};
    const fullName = student.full_name || student.username;
    // Extract parent name from full_name if it looks like "Parent / Student" or use the whole string
    const parentName = student.full_name || "";
    const html = buildEmailHtml(fullName, student.username, stats, parentName);
    const subject = buildSubject(parentName, fullName);
    try {
      await sendEmail(resendApiKey, parentEmail, subject, html);
      results.sent.push(parentEmail);
    } catch (err) {
      results.errors.push({ username: student.username, parentEmail, error: err.message });
    }
  }

  return res.status(200).json({
    sent: results.sent.length,
    skipped: results.skipped.length,
    errors: results.errors,
    detail: results,
  });
}
