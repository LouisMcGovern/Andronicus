-- Writing homework: students type answers, the teacher corrects them.
-- Run in the Supabase dashboard: SQL Editor → New query → paste this file → Run.
-- Safe to run more than once.

create extension if not exists "pgcrypto";

create table if not exists public.writing_submissions (
  id              uuid primary key default gen_random_uuid(),
  username        text not null references public.student_accounts(username) on delete cascade,
  level           text not null default '',
  task_id         text not null,
  task_text       text not null default '',
  attempt         integer not null default 1,
  body            text not null default '',
  status          text not null default 'draft'
                    check (status in ('draft', 'submitted', 'corrected')),
  correction_html text not null default '',
  teacher_note    text not null default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  submitted_at    timestamptz,
  corrected_at    timestamptz,
  unique (username, task_id, attempt)
);

create index if not exists writing_submissions_status_idx
  on public.writing_submissions (status, submitted_at desc);

-- No policies: the browser can only reach this table through the functions below.
alter table public.writing_submissions enable row level security;

create or replace function public._student_ok(p_username text, p_password text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.student_accounts a
    where a.username = btrim(coalesce(p_username, ''))
      and a.password = coalesce(p_password, '')
      and a.password <> ''
  );
$$;

-- Student: list own work. Corrections only appear once the teacher has sent them.
create or replace function public.student_list_writing(p_username text, p_password text)
returns table (
  id              uuid,
  level           text,
  task_id         text,
  attempt         integer,
  body            text,
  status          text,
  correction_html text,
  teacher_note    text,
  updated_at      timestamptz,
  submitted_at    timestamptz,
  corrected_at    timestamptz
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
    select w.id, w.level, w.task_id, w.attempt, w.body, w.status,
           case when w.status = 'corrected' then w.correction_html else '' end,
           case when w.status = 'corrected' then w.teacher_note else '' end,
           w.updated_at, w.submitted_at, w.corrected_at
    from public.writing_submissions w
    where w.username = btrim(p_username)
    order by w.task_id, w.attempt;
end;
$$;

-- Student: save the current draft (p_submit = false) or hand it in (p_submit = true).
-- Writes into the open draft for this task if there is one, otherwise starts a new attempt.
create or replace function public.student_save_writing(
  p_username  text,
  p_password  text,
  p_level     text,
  p_task_id   text,
  p_task_text text,
  p_body      text,
  p_submit    boolean
)
returns table (id uuid, attempt integer, status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_username text := btrim(coalesce(p_username, ''));
  v_task     text := btrim(coalesce(p_task_id, ''));
  v_body     text := coalesce(p_body, '');
  v_id       uuid;
  v_attempt  integer;
  v_status   text := case when p_submit then 'submitted' else 'draft' end;
begin
  if not public._student_ok(p_username, p_password) then
    raise exception 'Unauthorized';
  end if;
  if v_task = '' then
    raise exception 'Missing task';
  end if;
  if length(v_body) > 30000 then
    raise exception 'Text too long';
  end if;
  if p_submit and btrim(v_body) = '' then
    raise exception 'Empty submission';
  end if;

  select w.id, w.attempt into v_id, v_attempt
  from public.writing_submissions w
  where w.username = v_username and w.task_id = v_task and w.status = 'draft'
  order by w.attempt desc
  limit 1;

  if v_id is null then
    select coalesce(max(w.attempt), 0) + 1 into v_attempt
    from public.writing_submissions w
    where w.username = v_username and w.task_id = v_task;

    insert into public.writing_submissions
      (username, level, task_id, task_text, attempt, body, status, submitted_at)
    values
      (v_username, coalesce(p_level, ''), v_task, coalesce(p_task_text, ''), v_attempt,
       v_body, v_status, case when p_submit then now() else null end)
    returning writing_submissions.id into v_id;
  else
    update public.writing_submissions w
      set body         = v_body,
          status       = v_status,
          task_text    = coalesce(nullif(p_task_text, ''), w.task_text),
          level        = coalesce(nullif(p_level, ''), w.level),
          updated_at   = now(),
          submitted_at = case when p_submit then now() else null end
      where w.id = v_id;
  end if;

  return query select v_id, v_attempt, v_status;
end;
$$;

-- Teacher: everything that has been handed in (drafts stay private to the student).
create or replace function public.admin_list_writing(p_secret text)
returns table (
  id              uuid,
  username        text,
  full_name       text,
  level           text,
  task_id         text,
  task_text       text,
  attempt         integer,
  body            text,
  status          text,
  correction_html text,
  teacher_note    text,
  submitted_at    timestamptz,
  corrected_at    timestamptz
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
    select w.id, w.username, coalesce(a.full_name, ''), w.level, w.task_id, w.task_text,
           w.attempt, w.body, w.status, w.correction_html, w.teacher_note,
           w.submitted_at, w.corrected_at
    from public.writing_submissions w
    left join public.student_accounts a on a.username = w.username
    where w.status <> 'draft'
    order by w.submitted_at desc nulls last;
end;
$$;

-- Teacher: save a correction. p_send = true makes it visible to the student.
create or replace function public.admin_save_writing_correction(
  p_secret          text,
  p_id              uuid,
  p_correction_html text,
  p_teacher_note    text,
  p_send            boolean
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
  if length(coalesce(p_correction_html, '')) > 200000 then
    raise exception 'Correction too long';
  end if;
  update public.writing_submissions w
    set correction_html = coalesce(p_correction_html, ''),
        teacher_note    = coalesce(p_teacher_note, ''),
        status          = case when p_send then 'corrected' else w.status end,
        corrected_at    = case when p_send then now() else w.corrected_at end,
        updated_at      = now()
    where w.id = p_id and w.status <> 'draft';
end;
$$;

revoke all on function public._student_ok(text, text) from public, anon, authenticated;
grant execute on function public.student_list_writing(text, text) to anon, authenticated;
grant execute on function public.student_save_writing(text, text, text, text, text, text, boolean) to anon, authenticated;
grant execute on function public.admin_list_writing(text) to anon, authenticated;
grant execute on function public.admin_save_writing_correction(text, uuid, text, text, boolean) to anon, authenticated;
