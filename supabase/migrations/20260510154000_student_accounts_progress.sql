-- Persist student account progress in Supabase for long-term storage.

create table if not exists public.student_accounts (
  username text primary key,
  password text not null,
  full_name text not null default '',
  stats jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.student_accounts enable row level security;

create or replace function public.student_get_account(p_username text, p_password text)
returns table (
  username text,
  password text,
  full_name text,
  stats jsonb,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
    select a.username, a.password, a.full_name, a.stats, a.updated_at
    from public.student_accounts a
    where a.username = btrim(coalesce(p_username, ''))
      and a.password = coalesce(p_password, '');
end;
$$;

create or replace function public.student_upsert_account(
  p_username text,
  p_password text,
  p_full_name text,
  p_stats jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_username text := btrim(coalesce(p_username, ''));
  v_password text := coalesce(p_password, '');
begin
  if v_username = '' then
    raise exception 'Invalid username';
  end if;
  if v_password = '' then
    raise exception 'Invalid password';
  end if;

  insert into public.student_accounts (username, password, full_name, stats, updated_at)
  values (
    v_username,
    v_password,
    btrim(coalesce(p_full_name, '')),
    coalesce(p_stats, '{}'::jsonb),
    now()
  )
  on conflict (username) do update
    set password = excluded.password,
        full_name = excluded.full_name,
        stats = excluded.stats,
        updated_at = now();
end;
$$;

grant execute on function public.student_get_account(text, text) to anon, authenticated;
grant execute on function public.student_upsert_account(text, text, text, jsonb) to anon, authenticated;
