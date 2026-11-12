/**
 * Vercel serverless function: POST /api/stripe-webhook
 *
 * Stripe calls this after every completed checkout. For the "Cours d'anglais"
 * payment link it adds the number of classes bought to the student's prepaid
 * credit in Supabase (table class_credits), which the admin panel shows.
 *
 * Required environment variables (Vercel → Project Settings → Environment Variables):
 *   STRIPE_WEBHOOK_SECRET     — "Signing secret" (whsec_...) of the webhook endpoint in Stripe
 *   SUPABASE_SERVICE_ROLE_KEY — Supabase → Project Settings → API → service_role key
 *   ANDRONICUS_SUPABASE_URL   — your Supabase project URL (already set for the site)
 *
 * In Stripe: Developers → Webhooks → Add endpoint
 *   URL:    https://andronicus-two.vercel.app/api/stripe-webhook
 *   Events: checkout.session.completed, checkout.session.async_payment_succeeded
 */

import crypto from "node:crypto";

/** Price of one class in cents. Quantity = amount paid / this. */
const CLASS_PRICE_CENTS = 2500;
/** How old a Stripe signature may be before it is rejected (seconds). */
const SIGNATURE_TOLERANCE = 300;

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Checks the Stripe-Signature header (t=...,v1=...) against the raw body. */
function verifyStripeSignature(rawBody, header, secret) {
  if (!header || !secret) return false;
  let timestamp = "";
  const signatures = [];
  header.split(",").forEach(function (part) {
    const idx = part.indexOf("=");
    if (idx < 0) return;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k === "t") timestamp = v;
    if (k === "v1") signatures.push(v);
  });
  if (!timestamp || !signatures.length) return false;
  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
  if (!Number.isFinite(age) || age > SIGNATURE_TOLERANCE) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(timestamp + "." + rawBody, "utf8")
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");
  return signatures.some(function (sig) {
    const sigBuf = Buffer.from(sig, "hex");
    return sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf);
  });
}

/** The "Nom de l'élève" custom field from the payment page. */
function studentNameFrom(session) {
  const fields = Array.isArray(session.custom_fields) ? session.custom_fields : [];
  const textValue = function (f) {
    return f && f.text && typeof f.text.value === "string" ? f.text.value.trim() : "";
  };
  const named = fields.find(function (f) {
    const label = ((f.label && f.label.custom) || "") + " " + (f.key || "");
    return /l[eéè]ve|student|nom/i.test(label) && textValue(f);
  });
  const any = fields.find(textValue);
  const fromField = textValue(named) || textValue(any);
  if (fromField) return fromField;
  const details = session.customer_details || {};
  return (details.name || details.email || "").trim();
}

async function recordPurchase(supabaseUrl, serviceRoleKey, payload) {
  const res = await fetch(supabaseUrl + "/rest/v1/rpc/record_stripe_class_purchase", {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: "Bearer " + serviceRoleKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) throw new Error("Supabase error (" + res.status + "): " + text);
  return text;
}

export async function POST(request) {
  const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || "").trim();
  const supabaseUrl = (process.env.ANDRONICUS_SUPABASE_URL || "").trim().replace(/\/$/, "");
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!webhookSecret || !supabaseUrl || !serviceRoleKey) {
    return json(500, {
      error:
        "Server misconfigured. Set STRIPE_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY and ANDRONICUS_SUPABASE_URL in Vercel.",
    });
  }

  const rawBody = await request.text();
  if (!verifyStripeSignature(rawBody, request.headers.get("stripe-signature"), webhookSecret)) {
    return json(400, { error: "Invalid signature" });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (e) {
    return json(400, { error: "Invalid JSON" });
  }

  const handled = ["checkout.session.completed", "checkout.session.async_payment_succeeded"];
  if (!event || handled.indexOf(event.type) === -1) {
    return json(200, { received: true, ignored: event && event.type });
  }

  const session = (event.data && event.data.object) || {};
  if (session.payment_status !== "paid") {
    // e.g. a bank transfer still pending: async_payment_succeeded will follow
    return json(200, { received: true, ignored: "not paid yet" });
  }
  if (session.currency && session.currency !== "eur") {
    return json(200, { received: true, ignored: "not EUR" });
  }

  const amount = Number(session.amount_subtotal != null ? session.amount_subtotal : session.amount_total) || 0;
  const quantity = Math.round(amount / CLASS_PRICE_CENTS);
  if (quantity < 1) {
    return json(200, { received: true, ignored: "no classes in this payment" });
  }

  const details = session.customer_details || {};
  const studentName = studentNameFrom(session);
  if (!studentName) {
    return json(200, { received: true, ignored: "no student name" });
  }

  try {
    const result = await recordPurchase(supabaseUrl, serviceRoleKey, {
      p_session_id: session.id,
      p_student_name: studentName,
      p_parent_email: details.email || session.customer_email || null,
      p_quantity: quantity,
      p_amount_cents: amount,
    });
    return json(200, { received: true, result: result, student: studentName, classes: quantity });
  } catch (err) {
    console.error(err);
    // 500 makes Stripe retry later, so a payment is never lost
    return json(500, { error: "Could not record purchase" });
  }
}
