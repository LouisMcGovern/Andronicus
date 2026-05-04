-- Andronicus: public booking inserts + admin-only reads/writes via RPC.
-- After applying: open Table Editor → app_secrets → set value for key admin_api
-- to a long random string, and use the SAME string in your site config.js (adminApiSecret).

create extension if not exists "pgcrypto";

-- Secret used by RPC functions (not the browser admin UI password).
create table if not exists public.app_secrets (
  key text primary key,
  value text not null
);

alter table public.app_secrets enable row level security;

-- No policies: anon/authenticated cannot read this table; SECURITY DEFINER functions can.

insert into public.app_secrets (key, value)
values ('admin_api', 'replace-with-a-long-random-secret')
on conflict (key) do nothing;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  level text not null,
  slots text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

drop policy if exists "allow_public_insert_bookings" on public.bookings;
create policy "allow_public_insert_bookings"
  on public.bookings
  for insert
  to anon, authenticated
  with check (true);

create table if not exists public.payment_checklist (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  paid boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.payment_checklist enable row level security;

-- No direct access for anon; admin uses RPC only.

create or replace function public._admin_api_ok(p_secret text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.app_secrets s
    where s.key = 'admin_api'
      and s.value is not null
      and s.value <> ''
      and s.value = p_secret
  );
$$;

create or replace function public.admin_list_bookings(p_secret text)
returns table (
  id uuid,
  name text,
  phone text,
  level text,
  slots text[],
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public._admin_api_ok(p_secret) then
    raise exception 'Unauthorized';
  end if;
  return query
    select b.id, b.name, b.phone, b.level, b.slots, b.created_at
    from public.bookings b
    order by b.created_at desc;
end;
$$;

create or replace function public.admin_delete_booking(p_secret text, p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public._admin_api_ok(p_secret) then
    raise exception 'Unauthorized';
  end if;
  delete from public.bookings where id = p_id;
end;
$$;

create or replace function public.admin_list_payments(p_secret text)
returns table (
  id uuid,
  name text,
  paid boolean,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public._admin_api_ok(p_secret) then
    raise exception 'Unauthorized';
  end if;
  return query
    select p.id, p.name, p.paid, p.created_at
    from public.payment_checklist p
    order by p.created_at desc;
end;
$$;

create or replace function public.admin_add_payment(p_secret text, p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  if not public._admin_api_ok(p_secret) then
    raise exception 'Unauthorized';
  end if;
  if p_name is null or btrim(p_name) = '' then
    raise exception 'Invalid name';
  end if;
  insert into public.payment_checklist (name)
  values (btrim(p_name))
  returning id into new_id;
  return new_id;
end;
$$;

create or replace function public.admin_set_payment_paid(p_secret text, p_id uuid, p_paid boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public._admin_api_ok(p_secret) then
    raise exception 'Unauthorized';
  end if;
  update public.payment_checklist
  set paid = coalesce(p_paid, false)
  where id = p_id;
end;
$$;

create or replace function public.admin_delete_payment(p_secret text, p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public._admin_api_ok(p_secret) then
    raise exception 'Unauthorized';
  end if;
  delete from public.payment_checklist where id = p_id;
end;
$$;

grant usage on schema public to anon, authenticated;

grant insert on table public.bookings to anon, authenticated;

grant execute on function public.admin_list_bookings(text) to anon, authenticated;
grant execute on function public.admin_delete_booking(text, uuid) to anon, authenticated;
grant execute on function public.admin_list_payments(text) to anon, authenticated;
grant execute on function public.admin_add_payment(text, text) to anon, authenticated;
grant execute on function public.admin_set_payment_paid(text, uuid, boolean) to anon, authenticated;
grant execute on function public.admin_delete_payment(text, uuid) to anon, authenticated;

-- Do not expose the internal check; only the admin_* RPCs are callable from the API.
revoke all on function public._admin_api_ok(text) from public;
