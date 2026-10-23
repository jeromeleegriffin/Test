begin;
create schema if not exists career_private;
revoke all on schema career_private from public, anon;
create table public.rooks_careers (
 user_id uuid primary key references auth.users(id) on delete cascade,
 revision bigint not null check(revision>0),
 display_name text not null check(char_length(display_name) between 1 and 80),
 payload jsonb not null check(jsonb_typeof(payload)='object'),
 updated_at timestamptz not null default now()
);
create table public.rooks_career_versions (
 user_id uuid not null references auth.users(id) on delete cascade,
 revision bigint not null,
 display_name text not null,
 payload jsonb not null,
 reason text not null check(reason in ('save','restore')),
 created_at timestamptz not null default now(),
 primary key(user_id,revision)
);
alter table public.rooks_careers enable row level security;
alter table public.rooks_career_versions enable row level security;
revoke all on public.rooks_careers,public.rooks_career_versions from anon,authenticated;
grant select on public.rooks_careers,public.rooks_career_versions to authenticated;
create policy own_career_read on public.rooks_careers for select to authenticated using(user_id=(select auth.uid()));
create policy own_versions_read on public.rooks_career_versions for select to authenticated using(user_id=(select auth.uid()));
-- Only this checked transaction writes careers. No client can edit historical versions.
create function career_private.save_career(p_payload jsonb,p_expected_revision bigint,p_restore_revision bigint default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); current_rev bigint; new_rev bigint; data jsonb; canonical jsonb; name text; k text; v jsonb;
begin
 if uid is null or not exists(select 1 from auth.users where id=uid and email_confirmed_at is not null and coalesce(is_anonymous,false)=false) then
  raise exception 'Sign in with a verified player account' using errcode='42501';
 end if;
 perform pg_advisory_xact_lock(hashtextextended(uid::text,0));
 select revision into current_rev from public.rooks_careers where user_id=uid;
 if coalesce(current_rev,0)<>p_expected_revision or p_expected_revision is null then
  raise exception 'CAREER_CONFLICT: another device has a newer save' using errcode='40001';
 end if;
 if p_restore_revision is not null then
  select payload into p_payload from public.rooks_career_versions where user_id=uid and revision=p_restore_revision;
  if p_payload is null then raise exception 'Saved version not found'; end if;
 end if;
 if p_payload is null or octet_length(p_payload::text)>2097152 or p_payload->>'format' is distinct from 'GriffinHouseOfRooksCareerBackup' or p_payload->>'version' is distinct from '2' or jsonb_typeof(p_payload->'data') is distinct from 'object' then raise exception 'Invalid career backup'; end if;
 data:=p_payload->'data';
 if jsonb_typeof(data->'horCareerStateV2') is distinct from 'string' then raise exception 'Career must be migrated before cloud saving'; end if;
 canonical:=(data->>'horCareerStateV2')::jsonb;
 if canonical->>'schemaVersion' is distinct from '2' or canonical->>'migrationVersion' is distinct from '2' or jsonb_typeof(canonical->'records'->'human'->'stats') is distinct from 'object' or jsonb_typeof(canonical->'records'->'human'->'achievements') is distinct from 'object' or canonical->'identity'->>'id' is null or canonical->'identity'->>'id' is distinct from data->>'horLocalCareerActorV1' then raise exception 'Invalid career identity'; end if;
 for k,v in select * from jsonb_each(canonical->'records'->'human'->'stats') loop
  if jsonb_typeof(v)<>'number' or (v::text)::numeric<0 or trunc((v::text)::numeric)<>(v::text)::numeric or (v::text)::numeric>9007199254740991 then raise exception 'Invalid career counter'; end if;
 end loop;
 name:=canonical->'identity'->>'displayName';
 if name is null or char_length(name) not between 1 and 80 then raise exception 'Invalid player name'; end if;
 new_rev:=coalesce(current_rev,0)+1;
 insert into public.rooks_careers(user_id,revision,display_name,payload) values(uid,new_rev,name,p_payload)
 on conflict(user_id) do update set revision=excluded.revision,display_name=excluded.display_name,payload=excluded.payload,updated_at=now();
 insert into public.rooks_career_versions(user_id,revision,display_name,payload,reason) values(uid,new_rev,name,p_payload,case when p_restore_revision is null then 'save' else 'restore' end);
 return jsonb_build_object('revision',new_rev,'updated_at',now(),'display_name',name);
end; $$;
revoke all on function career_private.save_career(jsonb,bigint,bigint) from public,anon;
grant usage on schema career_private to authenticated;
grant execute on function career_private.save_career(jsonb,bigint,bigint) to authenticated;
create function public.rooks_save_career(p_payload jsonb,p_expected_revision bigint,p_restore_revision bigint default null)
returns jsonb language sql security invoker set search_path='' as $$select career_private.save_career(p_payload,p_expected_revision,p_restore_revision)$$;
revoke all on function public.rooks_save_career(jsonb,bigint,bigint) from public,anon;
grant execute on function public.rooks_save_career(jsonb,bigint,bigint) to authenticated;
comment on table public.rooks_careers is 'Private personal career backups, including imported/offline progress; not a verified competitive leaderboard.';
commit;
