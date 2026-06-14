-- Add parent_email column to student_accounts and bookings tables.
-- Run this migration in the Supabase SQL editor or via supabase db push.

-- 1. student_accounts — stores the parent email for progress email delivery
alter table public.student_accounts
  add column if not exists parent_email text not null default '';

-- 2. bookings — stores the parent email captured at booking time
alter table public.bookings
  add column if not exists parent_email text not null default '';

-- 3. Update student_get_account RPC to return parent_email
create or replace function public.student_get_account(p_username text, p_password text)
returns table (
  username     text,
  password     text,
  full_name    text,
  parent_email text,
  stats        jsonb,
  updated_at   timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
    select a.username, a.password, a.full_name, a.parent_email, a.stats, a.updated_at
    from public.student_accounts a
    where a.username = btrim(coalesce(p_username, ''))
      and a.password = coalesce(p_password, '');
end;
$$;

-- 4. Update student_upsert_account RPC to accept and store parent_email
create or replace function public.student_upsert_account(
  p_username     text,
  p_password     text,
  p_full_name    text,
  p_parent_email text,
  p_stats        jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_username     text := btrim(coalesce(p_username, ''));
  v_password     text := coalesce(p_password, '');
  v_parent_email text := btrim(coalesce(p_parent_email, ''));
begin
  if v_username = '' then
    raise exception 'Invalid username';
  end if;
  if v_password = '' then
    raise exception 'Invalid password';
  end if;

  insert into public.student_accounts (username, password, full_name, parent_email, stats, updated_at)
  values (
    v_username,
    v_password,
    coalesce(p_full_name, ''),
    v_parent_email,
    coalesce(p_stats, '{}'::jsonb),
    now()
  )
  on conflict (username) do update
    set password     = excluded.password,
        full_name    = excluded.full_name,
        parent_email = excluded.parent_email,
        stats        = excluded.stats,
        updated_at   = now();
end;
$$;
