-- Points: awards from the teacher (manual or for a corrected piece of writing).
-- Vocabulary points (1 per stepping stone) live in student_accounts.stats and are added on top in the app.
-- Run in the Supabase dashboard: SQL Editor → New query → paste this file → Run.
-- Needs 20261104120000_writing_submissions.sql to have been run first. Safe to run more than once.

create table if not exists public.point_awards (
  id            uuid primary key default gen_random_uuid(),
  username      text not null references public.student_accounts(username) on delete cascade,
  points        integer not null check (points <> 0 and points between -10000 and 10000),
  message       text not null default '',
  source        text not null default 'teacher' check (source in ('teacher', 'writing')),
  submission_id uuid unique references public.writing_submissions(id) on delete set null,
  created_at    timestamptz not null default now(),
  seen_at       timestamptz
);

create index if not exists point_awards_username_idx on public.point_awards (username, created_at desc);

-- No policies: the browser can only reach this table through the functions below.
alter table public.point_awards enable row level security;

create or replace function public.student_list_points(p_username text, p_password text)
returns table (
  id            uuid,
  points        integer,
  message       text,
  source        text,
  submission_id uuid,
  created_at    timestamptz,
  seen_at       timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public._student_ok(p_username, p_password) then
    raise exception 'Unauthorized';
  end if;
  return query
    select a.id, a.points, a.message, a.source, a.submission_id, a.created_at, a.seen_at
    from public.point_awards a
    where a.username = btrim(p_username)
    order by a.created_at desc;
end;
$$;

create or replace function public.student_mark_points_seen(p_username text, p_password text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public._student_ok(p_username, p_password) then
    raise exception 'Unauthorized';
  end if;
  update public.point_awards a
    set seen_at = now()
    where a.username = btrim(p_username) and a.seen_at is null;
end;
$$;

create or replace function public.admin_list_points(p_secret text)
returns table (
  id            uuid,
  username      text,
  points        integer,
  message       text,
  source        text,
  submission_id uuid,
  created_at    timestamptz,
  seen_at       timestamptz
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
    select a.id, a.username, a.points, a.message, a.source, a.submission_id, a.created_at, a.seen_at
    from public.point_awards a
    order by a.created_at desc;
end;
$$;

-- Give points. With p_submission_id the award belongs to that piece of writing:
-- sending again updates it, and 0 points removes it.
create or replace function public.admin_award_points(
  p_secret        text,
  p_username      text,
  p_points        integer,
  p_message       text,
  p_submission_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_username text := btrim(coalesce(p_username, ''));
  v_points   integer := coalesce(p_points, 0);
  v_id       uuid;
begin
  if not public._admin_api_ok(p_secret) then
    raise exception 'Unauthorized';
  end if;
  if not exists (select 1 from public.student_accounts s where s.username = v_username) then
    raise exception 'Unknown student';
  end if;
  if length(coalesce(p_message, '')) > 2000 then
    raise exception 'Message too long';
  end if;

  if p_submission_id is not null then
    if not exists (
      select 1 from public.writing_submissions w
      where w.id = p_submission_id and w.username = v_username
    ) then
      raise exception 'Unknown submission';
    end if;
    if v_points = 0 then
      delete from public.point_awards a where a.submission_id = p_submission_id;
      return null;
    end if;
    insert into public.point_awards (username, points, message, source, submission_id)
    values (v_username, v_points, coalesce(p_message, ''), 'writing', p_submission_id)
    on conflict (submission_id) do update
      set points  = excluded.points,
          message = excluded.message,
          seen_at = case when point_awards.points = excluded.points then point_awards.seen_at else null end
    returning point_awards.id into v_id;
    return v_id;
  end if;

  if v_points = 0 then
    raise exception 'Points must not be zero';
  end if;
  insert into public.point_awards (username, points, message, source)
  values (v_username, v_points, coalesce(p_message, ''), 'teacher')
  returning point_awards.id into v_id;
  return v_id;
end;
$$;

create or replace function public.admin_delete_points(p_secret text, p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public._admin_api_ok(p_secret) then
    raise exception 'Unauthorized';
  end if;
  delete from public.point_awards a where a.id = p_id;
end;
$$;

grant execute on function public.student_list_points(text, text) to anon, authenticated;
grant execute on function public.student_mark_points_seen(text, text) to anon, authenticated;
grant execute on function public.admin_list_points(text) to anon, authenticated;
grant execute on function public.admin_award_points(text, text, integer, text, uuid) to anon, authenticated;
grant execute on function public.admin_delete_points(text, uuid) to anon, authenticated;
