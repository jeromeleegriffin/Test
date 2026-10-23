begin;
insert into auth.users(id,email,email_confirmed_at,is_anonymous) values ('11111111-1234-4321-9876-111111111111','career-test-a@example.invalid',now(),false),('22222222-1234-4321-9876-222222222222','career-test-b@example.invalid',now(),false);
select set_config('request.jwt.claim.sub','11111111-1234-4321-9876-111111111111',true);
set local role authenticated;
do $$
declare p jsonb; r jsonb;
begin
p:=jsonb_build_object('format','GriffinHouseOfRooksCareerBackup','version',2,'data',jsonb_build_object('horLocalCareerActorV1','test-actor','horCareerStateV2',jsonb_build_object('schemaVersion',2,'migrationVersion',2,'identity',jsonb_build_object('id','test-actor','displayName','Test'),'records',jsonb_build_object('human',jsonb_build_object('stats',jsonb_build_object('points',10),'achievements','{}'::jsonb)))::text));
r:=public.rooks_save_career(p,0);if r->>'revision'<>'1' then raise exception 'First save failed';end if;
begin perform public.rooks_save_career(p,0);raise exception 'Stale write accepted';exception when serialization_failure then null;end;
begin perform public.rooks_save_career(p-'format',1);raise exception 'Missing format accepted';exception when raise_exception then if sqlerrm='Missing format accepted' then raise;end if;end;
begin update public.rooks_careers set revision=99;raise exception 'Direct update accepted';exception when insufficient_privilege then null;end;
perform public.rooks_save_career(p,1);
perform public.rooks_save_career(null,2,1);
if (select count(*) from public.rooks_career_versions)<>3 then raise exception 'History lost';end if;
end $$;
select set_config('request.jwt.claim.sub','22222222-1234-4321-9876-222222222222',true);
do $$ begin
if (select count(*) from public.rooks_careers)<>0 or (select count(*) from public.rooks_career_versions)<>0 then raise exception 'Cross-account data visible';end if;
begin perform public.rooks_save_career(null,0,1);raise exception 'Cross-account restore accepted';exception when raise_exception then if sqlerrm='Cross-account restore accepted' then raise;end if;end;
end $$;
reset role;
select 'PASS: own saves, stale rejection, invalid format, direct-write denial, history, account isolation, cross-account restore denial' as result;
rollback;
