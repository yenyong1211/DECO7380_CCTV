import test from 'node:test';
import assert from 'node:assert/strict';
import {normaliseStorage,deleteCloudCopies,storageView} from '../prototype/storage.js';
test('old deleted cloud state stays empty and never restores removed copies',()=>{const st={mode:'local',backup:true,deleted:true};normaliseStorage(st);assert.deepEqual(st.cloudCopies,[]);assert.equal(st.backup,false);normaliseStorage(st);assert.deepEqual(st.cloudCopies,[]);});
test('selective cloud deletion preserves other cloud videos and local preferences',()=>{const st={mode:'both',backup:true,retention:'30'};normaliseStorage(st);deleteCloudCopies(st,['emma21']);assert.deepEqual(st.cloudCopies,['james21','visitor23','request24']);assert.equal(st.mode,'both');assert.equal(st.backup,true);deleteCloudCopies(st,[...st.cloudCopies]);assert.deepEqual(st.cloudCopies,[]);assert.equal(st.deleted,true);});
test('storage switches and confirmation actions persist choices without deleting on toggle',()=>{
 const nodes=new Map();const node=id=>{if(!nodes.has(id))nodes.set(id,{id,checked:false,disabled:false,hidden:false,textContent:'',innerHTML:'',value:'',focus(){}});return nodes.get(id);};
 const app={innerHTML:'',querySelector:s=>s==='[data-cloud-video]:checked'?null:node(s),querySelectorAll:()=>[]};
 const st={mode:'local',backup:false,retention:'30'};let saved=0;storageView(app,st,()=>saved++,'');assert.equal((app.innerHTML.match(/role="switch"/g)||[]).length,3);
 node('#storage-cloud').checked=true;node('#storage-cloud').onchange();assert.equal(st.mode,'both');assert.equal(node('#storage-backup').disabled,false);assert.equal(st.cloudCopies.length,4);
 node('#storage-backup').checked=true;node('#storage-backup').onchange();assert.equal(st.backup,true);
 node('#storage-cloud').checked=false;node('#storage-cloud').onchange();assert.equal(st.mode,'local');assert.equal(st.backup,false);assert.equal(st.cloudCopies.length,4);
 node('#delete-cloud').onclick();assert.equal(st.cloudCopies.length,4);assert.equal(node('#cloud-delete-confirm').hidden,false);
 node('#cancel-cloud-delete').onclick();assert.equal(st.cloudCopies.length,4);
 node('#delete-cloud').onclick();node('#confirm-cloud-delete').onclick();assert.equal(st.cloudCopies.length,0);assert.match(node('#cloud-delete-result').textContent,/Local copies are unchanged/);assert.equal(st.mode,'local');assert.ok(saved>=4);
});
