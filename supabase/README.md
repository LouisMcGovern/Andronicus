# Supabase setup (Andronicus)

## 1. Create tables and functions

In the Supabase dashboard: **SQL** → **New query**, paste the contents of `migrations/20260501000000_bookings_and_admin.sql`, then **Run**.

## 2. Set the admin API secret

Open **Table Editor** → `app_secrets` → row `admin_api` → set **value** to a long random string (password manager).

Use the **same** string as `adminApiSecret` in your site’s `config.local.js`.

This secret is sent from the browser when you open the admin dashboard tabs for bookings and payments. It is separate from the small UI password you type to unlock admin.

## 3. Enable the site

Copy `config.example.js` to `config.local.js`, set `enabled: true`, and add **Project URL** and **anon public** key from **Project Settings → API**.

## 4. Optional: email when someone books

Use a **Database Webhook** on `bookings` insert (Supabase **Database** → **Webhooks**) to call:

- Zapier / Make.com, or
- a small serverless endpoint that sends email (Resend, SendGrid, etc.)

The site does not require this for bookings to appear in the admin table.
