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

function buildEmailHtml(fullName, username, stats) {
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
</style>
</head>
<body>
<div class="card">
  <h1>
    Bonjour ${escapeHtml(displayName)} !
    ${level ? `<span class="level-badge ${level}">${escapeHtml(levelLabel)}</span>` : ""}
  </h1>
  <p class="sub">Here is your Andronicus progress summary.</p>
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

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const FR_MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

function buildSubject(fullName) {
  const now = new Date();
  const month = FR_MONTHS[now.getMonth()];
  const year = now.getFullYear();
  const firstName = (fullName || "").trim().split(/\s+/)[0] || "Élève";
  return `Andronicus – Résultats de ${month} ${year} | ${firstName}`;
}
  return typeof str === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
}

async function fetchAllStudents(supabaseUrl, serviceRoleKey) {
  const url = `${supabaseUrl}/rest/v1/student_accounts?select=username,full_name,stats`;
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

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  if (!body || body.secret !== adminSecret) {
    return res.status(401).json({ error: "Unauthorised" });
  }

  let students;
  try {
    students = await fetchAllStudents(supabaseUrl, serviceRoleKey);
  } catch (err) {
    return res.status(502).json({ error: "Failed to fetch students: " + err.message });
  }

  const eligible = students.filter((s) => isEmail(s.username));
  const results = { sent: [], skipped: [], errors: [] };

  for (const student of eligible) {
    const stats = student.stats || {};
    const fullName = student.full_name || student.username;
    const html = buildEmailHtml(fullName, student.username, stats);
    const subject = buildSubject(fullName);
    try {
      await sendEmail(
        resendApiKey,
        student.username,
        subject,
        html
      );
      results.sent.push(student.username);
    } catch (err) {
      results.errors.push({ username: student.username, error: err.message });
    }
  }

  students
    .filter((s) => !isEmail(s.username))
    .forEach((s) => results.skipped.push(s.username));

  return res.status(200).json({
    sent: results.sent.length,
    skipped: results.skipped.length,
    errors: results.errors,
    detail: results,
  });
}
