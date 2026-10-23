const fs=require('fs'),vm=require('vm'),crypto=require('crypto'),assert=require('assert/strict');
const backup=JSON.parse(fs.readFileSync(process.argv[2]));
function run(source,seed={}){const map=new Map(Object.entries(seed));const storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k),key:i=>[...map.keys()][i],get length(){return map.size}};const ctx={localStorage:storage,crypto:crypto.webcrypto,console,TextEncoder};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync(source,'utf8'),ctx);vm.runInContext(fs.readFileSync('career-audit-progression.js','utf8').split('/* RookGame452')[0],ctx);return {P:ctx.HORProgression,map,storage};}
const seed={rookLifetimeStats:JSON.stringify({You:{isBot:false,points:0,hands:0}}),horLandingIdentityV1:JSON.stringify({name:'You'})};
const old=run('career-audit-career-core.js',seed);old.P.core.activate();assert.throws(()=>old.P.protection.restoreBackupObject(backup),/Identity conflict/);
const t=run('cloud-career/career-core-v46.js',seed);t.P.core.activate();t.P.protection.restoreBackupObject(backup);t.P.core.activate();const s=t.P.core.read();assert.equal(s.identity.displayName,'Rita');assert.equal(s.records.human.stats.points,33845);assert.equal(s.records.human.stats.hands,343);assert.equal(s.records.human.stats.gamesPlayed,69);
const legacy=Object.entries(backup.data).find(([k])=>k.includes(':human:'))[1];for(const id of Object.keys(JSON.parse(legacy).achievements))assert.ok(s.records.human.achievements[id]||s.records.human.retiredAchievements[id]);
const newer=run('cloud-career/career-core-v46.js',{rookLifetimeStats:JSON.stringify({You:{isBot:false,points:1,hands:1}})});newer.P.core.activate();const before=JSON.stringify([...newer.map]);assert.throws(()=>newer.P.protection.restoreBackupObject(backup),/Identity conflict/);assert.equal(JSON.stringify([...newer.map]),before);
const invalid=structuredClone(backup);invalid.data.rookLifetimeStats='broken';const clean=run('cloud-career/career-core-v46.js');assert.throws(()=>clean.P.protection.restoreBackupObject(invalid));assert.equal(clean.map.size,0);
console.log('PASS old failure reproduced; exact backup restores name/points/hands/games and every saved award; nonzero career protected; invalid backup writes nothing');
console.log('Awards active:',Object.keys(s.records.human.achievements).length,'historical:',Object.keys(s.records.human.retiredAchievements).length);

const incoming=t.P.protection.buildBackup();
const safety=newer.P.protection.buildBackup();
assert.throws(()=>newer.P.protection.restoreBackupObject(incoming,{expectedLocalHash:'stale'}),/Local career changed/);
newer.P.protection.restoreBackupObject(incoming,{expectedLocalHash:newer.P.core.digest(newer.P.core.collect())});
assert.equal(newer.P.core.read().identity.displayName,'Rita');
const preserved=JSON.parse(newer.storage.getItem('horBeforeCloudRecoveryV1'));
assert.equal(JSON.stringify(preserved.data),JSON.stringify(safety.data));
console.log('PASS explicit recovery preserves prior career and rejects stale local state');
