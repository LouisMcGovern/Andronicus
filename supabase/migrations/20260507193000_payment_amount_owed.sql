-- Add owed amount tracking for payment checklist.

alter table if exists public.payment_checklist
  add column if not exists owed_amount numeric(10,2) not null default 0;

update public.payment_checklist
set owed_amount = coalesce(owed_amount, 0)
where owed_amount is null;

create or replace function public.admin_list_payments(p_secret text)
returns table (
  id uuid,
  name text,
  paid boolean,
  owed_amount numeric,
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
    select p.id, p.name, p.paid, p.owed_amount, p.created_at
    from public.payment_checklist p
    order by p.created_at desc;
end;
$$;

create or replace function public.admin_add_payment(
  p_secret text,
  p_name text,
  p_owed_amount numeric default 0
)
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
  insert into public.payment_checklist (name, owed_amount)
  values (
    btrim(p_name),
    greatest(0, coalesce(p_owed_amount, 0))
  )
  returning id into new_id;
  return new_id;
end;
$$;

create or replace function public.admin_set_payment_owed(
  p_secret text,
  p_id uuid,
  p_owed_amount numeric
)
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
  set owed_amount = greatest(0, coalesce(p_owed_amount, 0))
  where id = p_id;
end;
$$;

grant execute on function public.admin_add_payment(text, text, numeric) to anon, authenticated;
grant execute on function public.admin_set_payment_owed(text, uuid, numeric) to anon, authenticated;
