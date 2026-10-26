import test from 'node:test';
import assert from 'node:assert/strict';
import {cameraEventsContent} from '../prototype/cloud-events.js';
test('daily cloud task coexists with each day’s video requests and detections',()=>{
 for(const [day,clips] of [[20,[]],[21,['emma21','james21']],[23,['visitor23']],[24,['request24']]]){
  const html=cameraEventsContent(day);assert.match(html,/Daily cloud backup request/);
  for(const id of clips)assert.ok(html.includes(`data-clip="${id}"`));
 }
});
test('time filtering can retain a detection without the overnight cloud task',()=>{
 const html=cameraEventsContent(23,'18:00','19:00');assert.ok(!html.includes('Daily cloud backup request'));assert.ok(html.includes('data-clip="visitor23"'));
});
