import test from 'node:test';
import assert from 'node:assert/strict';
import {search,eufyURL,routes,rubric,controlRubric} from '../privacy/knowledge.js';
for(const [query,stage,route] of [
 ['Who can see my camera?','SEE','events/access'],
 ['Who accessed my camera yesterday?','REVIEW','events/access'],
 ['How do I stop Emma seeing my camera?','CONTROL','events/permissions/emma'],
 ['How do I change James permission?','CONTROL','events/permissions/james'],
 ['Where are my videos stored?','UNDERSTAND','services'],
 ['Why is Data Access Exposure 5/10?','UNDERSTAND','events/access'],
 ['Open Services','CONTROL','services'],
 ['Open messages','REVIEW','messages'],
 ['Notification settings','REVIEW','notifications'],
 ['Show my living room camera','SEE','device/living-room'],
 ['Show my front door camera','SEE','device/front-door']
])test(query,()=>{const r=search(query);assert.equal(r.stage,stage);assert.ok(r.actions.some(a=>a.route===route));});
test('yesterday is fixed demo date and matching seed visits',()=>{const r=search('Who accessed yesterday?');assert.match(r.title,/20 October 2026/);assert.match(r.facts[0][1],/14:10, recording, Living Room/);assert.match(r.facts[0][1],/18:20, live video, Living Room/);assert.match(r.facts[1][1],/No date filter is applied automatically/);});
test('unsupported questions are bounded and empty input ignored',()=>{assert.equal(search('   '),null);assert.equal(search('What is my password?').actions.length,0);assert.equal(search('<script>alert(1)</script>').actions.length,0);});
for(const base of ['http://127.0.0.1:7380/','http://localhost:7380/DECO7380_CCTV/','https://yenyong1211.github.io/DECO7380_CCTV/'])test(`deep links retain hosting base: ${base}`,()=>{for(const route of routes){const u=new URL(eufyURL(route,base));assert.equal(u.origin,new URL(base).origin);assert.equal(u.pathname,new URL('prototype/',base).pathname);assert.equal(u.hash,`#${route}`);}});
test('route allowlist rejects unknown/external destinations',()=>assert.throws(()=>eufyURL('https://example.com/','http://localhost/')));
test('original exposure factors restored with 5/10 total',()=>{assert.deepEqual(rubric.map(r=>r.label),['Support access','Other-user access','Cloud recording','External processing','Secondary video use']);assert.equal(rubric.reduce((n,r)=>n+r.points,0),5);assert.equal(rubric.reduce((n,r)=>n+r.max,0),10);});
test('control rubric sums to 8/10',()=>{assert.equal(controlRubric.reduce((n,r)=>n+r.points,0),8);assert.equal(controlRubric.reduce((n,r)=>n+r.max,0),10);});
test('support and encryption questions do not invent account access',()=>{assert.match(search('Can eufy support see my videos?').summary,/cannot verify/);assert.match(search('Is my video encrypted?').summary,/cannot certify/);});
test('cloud and recording removal questions do not offer unrelated viewer controls',()=>{for(const q of ['How do I stop cloud backup?','How do I remove recordings?']){const r=search(q);assert.equal(r.stage,'UNDERSTAND');assert.ok(r.actions.some(a=>a.route==='services'));assert.ok(!r.actions.some(a=>a.route.includes('permissions')));}});
