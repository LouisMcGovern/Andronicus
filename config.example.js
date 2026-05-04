/**
 * Copy this file to config.local.js (same folder as index.html) and fill in values.
 * config.local.js is gitignored so keys stay off the repo.
 *
 * 1) Create a project at https://supabase.com
 * 2) Run the SQL in supabase/migrations/ (SQL Editor → New query → paste → Run)
 * 3) Table app_secrets: set admin_api value to a long random string
 * 4) Project Settings → API: copy Project URL and anon public key into this file
 */
window.ANDRONICUS_CONFIG = {
  /** Set true only after URL, anon key, and adminApiSecret are configured. */
  enabled: false,
  supabaseUrl: "https://YOUR_PROJECT_REF.supabase.co",
  supabaseAnonKey: "YOUR_ANON_PUBLIC_KEY",
  /** Must match the value of app_secrets.admin_api in Supabase (not your UI password). */
  adminApiSecret: "same-long-random-string-as-in-app_secrets-table",
};
