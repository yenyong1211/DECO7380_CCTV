const sampleClips=[
 {id:'emma21',label:'Oct 21 · Living Room · Keys check'},
 {id:'james21',label:'Oct 21 · Front Door · Parcel check'},
 {id:'visitor23',label:'Oct 23 · Front Door · Visitor alert'},
 {id:'request24',label:'Oct 24 · Living Room · Cat feeding'}
];
export function normaliseStorage(st){
 if(!Array.isArray(st.cloudCopies))st.cloudCopies=st.deleted?[]:sampleClips.map(c=>c.id);
 st.cloudCopies=st.cloudCopies.filter(id=>sampleClips.some(c=>c.id===id));
 if(!['local','cloud','both','none'].includes(st.mode))st.mode='local';
 if(st.mode==='local'||st.mode==='none')st.backup=false;
 return st;
}
export function deleteCloudCopies(st,ids){normaliseStorage(st);const remove=new Set(ids);st.cloudCopies=st.cloudCopies.filter(id=>!remove.has(id));st.deleted=!st.cloudCopies.length;}
const toggle=(id,title,copy)=>`<label class="storage-toggle-row" for="${id}"><span><strong>${title}</strong><small>${copy}</small></span><span class="storage-switch"><input type="checkbox" role="switch" id="${id}"><span class="storage-switch-track" aria-hidden="true"></span></span></label>`;
export function storageView(app,st,save,intro){
 normaliseStorage(st);app.className='native-page';
 app.innerHTML=`<div class="page-heading"><a href="#services/list" aria-label="Back to Services">‹</a><h1>Storage & Backup</h1></div>${intro}<section class="fx-card"><h2>Storage location</h2><p>Choose where to save recordings. These preferences apply to the household demo.</p>${toggle('storage-local','Local storage','Save new recordings on local storage.')}${toggle('storage-cloud','Cloud storage','Allow new recordings to be saved to the vendor cloud.')}${toggle('storage-backup','Automatic cloud backup','Back up automatically while cloud storage is enabled.')}<label class="fx-field">Cloud retention <select id="storage-retention"><option value="7">7 days</option><option value="30">30 days</option><option value="90">90 days</option></select></label><p id="storage-mode-summary"></p><p>Local storage: 14.1 GB used / 128 GB demo capacity.</p><p id="cloud-usage"></p><p class="fx-note">Turning a switch off stops future saving or backup in this prototype. It does not delete existing videos. These are proposed options, not confirmed compatibility for every product.</p><p id="storage-status" role="status" aria-live="polite"></p></section><section class="fx-card"><h2>Cloud videos</h2><p>Select videos to delete from the cloud. Local copies and downloaded copies stay available.</p><div id="cloud-video-list"></div><div class="fx-buttons"><button class="eufy-secondary" id="delete-cloud-selected">Delete selected cloud videos</button><button class="eufy-secondary" id="delete-cloud">Delete all cloud videos</button></div><div id="cloud-delete-confirm" class="storage-confirm" hidden><p id="cloud-delete-question"></p><div class="fx-buttons"><button class="eufy-primary" id="confirm-cloud-delete">Confirm deletion</button><button class="eufy-secondary" id="cancel-cloud-delete">Cancel</button></div></div><p id="cloud-delete-result" role="status" aria-live="polite"></p><p class="fx-note">Deletion updates the demo cloud list only. No real account files are removed.</p></section><a class="eufy-secondary" href="#sightings">View local demo clips</a>`;
 const local=app.querySelector('#storage-local'),cloud=app.querySelector('#storage-cloud'),backup=app.querySelector('#storage-backup'),retention=app.querySelector('#storage-retention'),status=app.querySelector('#storage-status');
 local.checked=['local','both'].includes(st.mode);cloud.checked=['cloud','both'].includes(st.mode);backup.checked=!!st.backup;retention.value=st.retention||'30';
 const summary=()=>{backup.disabled=!cloud.checked;retention.disabled=!cloud.checked;if(!cloud.checked)backup.checked=false;app.querySelector('#storage-mode-summary').textContent=`Local storage: ${local.checked?'On':'Off'} · Cloud storage: ${cloud.checked?'On':'Off'} · Automatic backup: ${backup.checked?'On':'Off'}`;};summary();
 const update=()=>{summary();st.mode=local.checked?(cloud.checked?'both':'local'):(cloud.checked?'cloud':'none');st.backup=backup.checked;st.retention=retention.value;save();status.textContent=st.mode==='none'?'Saved · Saving new recordings is off. Existing videos have not been deleted.':'Saved · Storage preferences updated. Existing videos have not been deleted.';};
 [local,cloud,backup,retention].forEach(input=>input.onchange=update);
 let pending=[];
 const panel=app.querySelector('#cloud-delete-confirm'),selectedButton=app.querySelector('#delete-cloud-selected'),allButton=app.querySelector('#delete-cloud');
 const cancel=()=>{pending=[];panel.hidden=true;};
 const renderVideos=()=>{
 app.querySelector('#cloud-usage').textContent=`Cloud storage: ${(st.cloudCopies.length*.3).toFixed(1)} GB used / 10 GB demo capacity`;
 app.querySelector('#cloud-video-list').innerHTML=st.cloudCopies.length?sampleClips.filter(c=>st.cloudCopies.includes(c.id)).map(c=>`<label class="storage-clip"><input type="checkbox" data-cloud-video="${c.id}"><span>${c.label}<small>Cloud copy · 0.3 GB · Demo</small></span><a href="#sightings" data-clip="${c.id}">View Video</a></label>`).join(''):'<p>No videos stored in the demo cloud. Local demo clips are still available.</p>';
 selectedButton.disabled=true;allButton.disabled=!st.cloudCopies.length;
 app.querySelectorAll('[data-cloud-video]').forEach(input=>input.onchange=()=>{cancel();selectedButton.disabled=!app.querySelector('[data-cloud-video]:checked');});
 };
 const requestDelete=ids=>{if(!ids.length)return;pending=[...ids];app.querySelector('#cloud-delete-question').textContent=`Delete ${pending.length} cloud video${pending.length===1?'':'s'}? Local and downloaded copies will remain.`;panel.hidden=false;app.querySelector('#confirm-cloud-delete').focus();};
 selectedButton.onclick=()=>requestDelete([...app.querySelectorAll('[data-cloud-video]:checked')].map(input=>input.dataset.cloudVideo));allButton.onclick=()=>requestDelete(st.cloudCopies);
 app.querySelector('#cancel-cloud-delete').onclick=()=>{cancel();allButton.focus();};
 app.querySelector('#confirm-cloud-delete').onclick=()=>{if(!pending.length)return;const count=pending.length;deleteCloudCopies(st,pending);save();cancel();renderVideos();app.querySelector('#cloud-delete-result').textContent=`Deleted ${count} demo cloud video${count===1?'':'s'}. Local copies are unchanged.`;};
 renderVideos();
}
