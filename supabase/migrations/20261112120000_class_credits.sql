-- Prepaid class credits, filled automatically by Stripe payments.
-- Run in Supabase: SQL → New query → paste this file → Run.

create table if not exists public.class_credits (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  parent_email text,
  classes_owed integer not null default 0,
  total_purchased integer not null default 0,
  last_payment_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists class_credits_name_key
  on public.class_credits (lower(btrim(student_name)));

-- One row per Stripe checkout, so a payment is never counted twice
-- (Stripe can send the same event more than once).
create table if not exists public.stripe_class_payments (
  session_id text primary key,
  student_name text not null,
  parent_email text,
  quantity integer not null,
  amount_cents integer not null,
  created_at timestamptz not null default now()
);

alter table public.class_credits enable row level security;
alter table public.stripe_class_payments enable row level security;
-- No policies: the browser only reaches these tables through the admin_* functions below.

-- Your current student, starting at 0 (set his real number in the admin panel).
insert into public.class_credits (student_name, classes_owed)
select 'Lo', 0
where not exists (
  select 1 from public.class_credits where lower(btrim(student_name)) = 'lo'
);

-- Called only by the Stripe webhook on Vercel (service role key).
create or replace function public.record_stripe_class_purchase(
  p_session_id text,
  p_student_name text,
  p_parent_email text,
  p_quantity integer,
  p_amount_cents integer
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := btrim(coalesce(p_student_name, ''));
  v_inserted integer;
begin
  if p_session_id is null or p_session_id = '' or v_name = '' or coalesce(p_quantity, 0) < 1 then
    raise exception 'Invalid purchase';
  end if;

  insert into public.stripe_class_payments (session_id, student_name, parent_email, quantity, amount_cents)
  values (p_session_id, v_name, nullif(btrim(coalesce(p_parent_email, '')), ''), p_quantity, coalesce(p_amount_cents, 0))
  on conflict (session_id) do nothing;
  get diagnostics v_inserted = row_count;
  if v_inserted = 0 then
    return 'duplicate';
  end if;

  insert into public.class_credits (student_name, parent_email, classes_owed, total_purchased, last_payment_at)
  values (v_name, nullif(btrim(coalesce(p_parent_email, '')), ''), p_quantity, p_quantity, now())
  on conflict ((lower(btrim(student_name)))) do update
    set classes_owed = public.class_credits.classes_owed + excluded.classes_owed,
        total_purchased = public.class_credits.total_purchased + excluded.total_purchased,
        parent_email = coalesce(excluded.parent_email, public.class_credits.parent_email),
        last_payment_at = now(),
        updated_at = now();
  return 'recorded';
end;
$$;

revoke all on function public.record_stripe_class_purchase(text, text, text, integer, integer) from public, anon, authenticated;
grant execute on function public.record_stripe_class_purchase(text, text, text, integer, integer) to service_role;

create or replace function public.admin_list_class_credits(p_secret text)
returns table (
  id uuid,
  student_name text,
  parent_email text,
  classes_owed integer,
  total_purchased integer,
  last_payment_at timestamptz
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
    select c.id, c.student_name, c.parent_email, c.classes_owed, c.total_purchased, c.last_payment_at
    from public.class_credits c
    order by lower(c.student_name);
end;
$$;

create or replace function public.admin_set_class_credits(p_secret text, p_id uuid, p_classes integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new integer;
begin
  if not public._admin_api_ok(p_secret) then
    raise exception 'Unauthorized';
  end if;
  update public.class_credits
  set classes_owed = coalesce(p_classes, 0), updated_at = now()
  where id = p_id
  returning classes_owed into v_new;
  return v_new;
end;
$$;

create or replace function public.admin_add_class_credit_student(p_secret text, p_name text, p_classes integer)
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
  insert into public.class_credits (student_name, classes_owed)
  values (btrim(p_name), coalesce(p_classes, 0))
  returning id into new_id;
  return new_id;
end;
$$;

create or replace function public.admin_delete_class_credit(p_secret text, p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public._admin_api_ok(p_secret) then
    raise exception 'Unauthorized';
  end if;
  delete from public.class_credits where id = p_id;
end;
$$;

grant execute on function public.admin_list_class_credits(text) to anon, authenticated;
grant execute on function public.admin_set_class_credits(text, uuid, integer) to anon, authenticated;
grant execute on function public.admin_add_class_credit_student(text, text, integer) to anon, authenticated;
grant execute on function public.admin_delete_class_credit(text, uuid) to anon, authenticated;
