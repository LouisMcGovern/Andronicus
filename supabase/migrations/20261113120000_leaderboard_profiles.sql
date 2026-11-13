-- Leaderboard profiles: students can choose the name and the character (animal + accessories)
-- shown on the leaderboard. Both are saved in their stats (stats.profile.displayName / .avatar)
-- by the site, so no new table is needed: this only updates the leaderboard function.
-- Also recognises the French course levels (fr-beginner, fr-intermediate, fr-advanced).
--
-- Run in the Supabase dashboard: SQL Editor → New query → paste this file → Run.
-- Needs the leaderboard file (20261105180000…) to have been run first. Safe to run more than once.

-- The list of returned columns changes (new "avatar" column), so the old version must be dropped first.
drop function if exists public.student_leaderboard(text, text);

create function public.student_leaderboard(p_username text, p_password text)
returns table (
  rank         integer,
  display_name text,
  level        text,
  points       integer,
  is_me        boolean,
  avatar       jsonb
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
        -- chosen name: letters, numbers, spaces and . _ ' - only, 20 characters max
        left(btrim(regexp_replace(coalesce(a.stats -> 'profile' ->> 'displayName', ''),
                                  '[^[:alnum:][:space:]._''’-]', '', 'g')), 20) as chosen,
        case when jsonb_typeof(a.stats -> 'profile' -> 'avatar') = 'object'
             then a.stats -> 'profile' -> 'avatar' else null end as av,
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
          when length(t.chosen) >= 2 then t.chosen
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
      case when n.lvl in ('beginner', 'intermediate', 'advanced',
                          'fr-beginner', 'fr-intermediate', 'fr-advanced') then n.lvl else '' end,
      n.pts,
      n.username = v_me,
      -- only the character's parts are returned (animal, background, hat, glasses, neck)
      case when n.av is null then null
           else jsonb_build_object(
             'animal', n.av ->> 'animal',
             'bg',     n.av ->> 'bg',
             'hat',    n.av ->> 'hat',
             'eyes',   n.av ->> 'eyes',
             'neck',   n.av ->> 'neck')
      end
    from named n
    order by n.pts desc, n.shown asc
    limit 200;
end;
$$;

grant execute on function public.student_leaderboard(text, text) to anon, authenticated;
