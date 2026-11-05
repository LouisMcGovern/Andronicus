-- Leaderboard shown to students: one list for every level, ranked by points.
-- Points = vocabulary points (stats.learningHub.vocabPoints) + points given by the teacher (point_awards).
-- Only logged-in students can see it, and only first name + initial, level and points are returned.
-- Run in the Supabase dashboard: SQL Editor → New query → paste this file → Run.
-- Needs the writing (20261104…) and points (20261105120000…) files to have been run first. Safe to run more than once.

create or replace function public.student_leaderboard(p_username text, p_password text)
returns table (
  rank         integer,
  display_name text,
  level        text,
  points       integer,
  is_me        boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me text := btrim(coalesce(p_username, ''));
begin
  if not public._student_ok(p_username, p_password) then
    raise exception 'Unauthorized';
  end if;

  return query
    with totals as (
      select
        a.username,
        btrim(coalesce(a.full_name, '')) as full_name,
        coalesce(a.stats -> 'learningHub' ->> 'lastLevel', '') as lvl,
        (case
           when jsonb_typeof(a.stats -> 'learningHub' -> 'vocabPoints') = 'number'
             then greatest(0, floor((a.stats -> 'learningHub' ->> 'vocabPoints')::numeric))::integer
           else 0
         end)
        + coalesce((select sum(p.points)::integer from public.point_awards p where p.username = a.username), 0)
          as pts
      from public.student_accounts a
    ),
    named as (
      select
        t.*,
        case
          when t.full_name = '' then 'Élève'
          when position(' ' in t.full_name) = 0 then initcap(t.full_name)
          else initcap(split_part(t.full_name, ' ', 1)) || ' '
               || upper(left(regexp_replace(t.full_name, '^.*\s', ''), 1)) || '.'
        end as shown
      from totals t
    )
    select
      (rank() over (order by n.pts desc))::integer,
      n.shown,
      case when n.lvl in ('beginner', 'intermediate', 'advanced') then n.lvl else '' end,
      n.pts,
      n.username = v_me
    from named n
    order by n.pts desc, n.shown asc
    limit 200;
end;
$$;

grant execute on function public.student_leaderboard(text, text) to anon, authenticated;
