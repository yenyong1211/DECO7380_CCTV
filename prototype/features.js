import { storageView } from './storage.js?v=storage-switches-1';
// Local interactive study data only; no connected device, cloud or real approval service.
export const requests=[
 {id:'emma21',day:21,time:'10:20',person:'Emma',device:'eufyCam S3 Pro',place:'Living Room',title:'Emma requests a recording',detail:'Recording: 21 Oct, 09:00–09:05. Request reason: I want to check whether I left my keys in the living room.'},
 {id:'james21',day:21,time:'08:05',person:'James',device:'Video Doorbell E340',place:'Front Door',title:'James requests a doorbell clip',detail:'Recording: 21 Oct, 07:30–07:35. Request reason: I want to check whether my parcel arrived at the front door.'},
 {id:'visitor23',day:23,time:'18:12',person:'Unrecognised visitor',device:'Video Doorbell E340',place:'Front Door',title:'Unrecognised person near your door',detail:'A person remained near the entrance for about two minutes. Their identity and intention are unknown.',sighting:true},
 {id:'request24',day:24,time:'14:08',person:'Emma',device:'eufyCam S3 Pro',place:'Living Room',title:'Emma requests a clip containing you',detail:'Recording: 24 Oct, 13:50–13:55. Request reason: I want to check whether the cat has eaten. You and your cat appear in this clip.'}
];
const key='cctv.prototype.clip-requests.v1';
const initial=()=>({decisions:{},logs:[],storage:{mode:'local',backup:false,retention:'30'},consent:{}});
let state=initial();try{state={...state,...JSON.parse(localStorage.getItem(key)||'{}')};}catch{}
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch{}}
function log(r,action){state.logs.unshift({id:r.id,day:r.day,time:r.time,person:r.person,device:r.device,action});save();}
export function decide(id,choice,visibility='faces'){
 const r=requests.find(r=>r.id===id);if(!r||r.sighting)return false;
 state.decisions[id]={choice,visibility,remaining:choice==='once'?1:0};
 log(r,choice==='deny'?'Request denied':choice==='once'?'Approved once · not yet viewed':choice==='repeat'?'Repeated access approved for this clip':'Permission revoked');return true;
}
export function consume(id){const r=requests.find(r=>r.id===id),d=state.decisions[id];if(!r||!d||!['once','repeat'].includes(d.choice)||(d.choice==='once'&&d.remaining!==1))return null;if(d.choice==='once')d.remaining=0;log(r,'Viewed approved clip'+(d.choice==='once'?' · one-time permission used':''));return d.visibility;}
export const clipVariant=visibility=>visibility==='original'?'original':visibility==='person'?'person':'masked';
export const visibilityLabel=visibility=>visibility==='original'?'Original view':visibility==='person'?'Whole person hidden':'Face hidden';
const status=r=>{const d=state.decisions[r.id];return !d?'Pending':d.choice==='once'?(d.remaining?'Allowed once · unused':'One-time permission used'):d.choice==='repeat'?'Repeated access allowed':d.choice==='deny'?'Denied':'Revoked';};
function card(r){return `<article class="fx-card"><div class="fx-row"><div><h3>${r.title}</h3><p>Oct ${r.day} · ${r.time} · ${r.device}</p></div><span class="badge">${r.sighting?'Sighting':status(r)}</span></div><p>${r.detail}</p><button class="eufy-secondary" data-clip="${r.id}">View Video</button></article>`;}
export function requestCards(day,from='00:00',to='23:59'){return `<section class="fx-section"><div class="fx-row"><h2>Requests & notifications</h2><a href="#sightings">View all</a></div>${requests.filter(r=>r.day===day&&r.time>=from&&r.time<=to).map(card).join('')||'<p>No requests for this date.</p>'}</section>`;}
export function decisionHistory(day){const logs=state.logs.filter(l=>l.day===day);return logs.length?`<section class="fx-section"><h2>Request decisions & actual views</h2>${logs.map(l=>`<div class="fx-log"><strong>${safe(l.person)}</strong><span>${safe(l.action)}</span><small>Oct ${l.day} · ${l.time} · ${safe(l.device)} · Demo</small></div>`).join('')}</section>`:'';}
function modal(id){
 const r=requests.find(r=>r.id===id);if(!r)return;
 document.querySelector('#clip-dialog')?.remove();
 const dialog=document.createElement('dialog');dialog.id='clip-dialog';dialog.className='fx-dialog';
 const d=state.decisions[id];
 dialog.innerHTML=`<button class="fx-close" aria-label="Close video preview">×</button><h2>${r.title}</h2><p>Oct ${r.day} · ${r.device} · Simulated animation</p><p>${r.detail}</p><video controls playsinline preload="metadata" poster="clips/${id}-masked.png" src="clips/${id}-masked.mp4" aria-label="Face-masked animated video preview"></video><p class="fx-note">Choose a visibility option to preview what the viewer will see. Previewing does not grant access.</p><div id="clip-options">${r.sighting?`<p>The visitor is not a registered user. No identity or intent has been inferred.</p><button class="eufy-secondary" id="dismiss-sighting">Dismiss alert</button><details><summary>Original-visibility request (demo)</summary><p>Original footage stays locked until a simulated consent review is completed. This does not contact a person or police.</p><button class="eufy-secondary" id="request-consent">Request review</button><button class="eufy-secondary" id="simulate-consent" hidden>Simulate subject consent</button><button class="eufy-secondary" id="show-original" hidden>View consent-approved original</button></details>`:`<p>Play the preview before making a decision.</p><label class="fx-field">What ${r.person} may see <select id="clip-visibility"><option value="faces">Face hidden</option><option value="person">Whole person hidden</option><option value="original">Original view (your consent)</option></select></label><div class="fx-buttons" id="approval-buttons"><button class="eufy-secondary" data-choice="deny" disabled>Deny</button><button class="eufy-primary" data-choice="once" disabled>Allow once</button><button class="eufy-secondary" data-choice="repeat" disabled>Allow until revoked</button></div><p class="fx-note">Applies only to this recorded clip, not live cameras or other recordings. Allow once permits one playback. Allow until revoked permits repeated viewing of this clip until you revoke it.</p><div class="fx-buttons"><button class="eufy-secondary" id="viewer-test">Open as ${r.person} (demo)</button><button class="eufy-secondary" data-choice="revoke">Revoke access</button></div>`}</div><p id="clip-result" role="status" aria-live="polite">${r.sighting?'Face hidden by default.':status(r)}</p>`;
 document.body.append(dialog);dialog.showModal();const video=dialog.querySelector('video'),result=dialog.querySelector('#clip-result');
 dialog.querySelector('.fx-close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{video.pause();dialog.remove();window.dispatchEvent(new Event('cctv:clips-updated'));});
 let previewed=false, endPlayback=null;
 const changeVideo=(visibility,play=false)=>{
 if(endPlayback){video.removeEventListener('ended',endPlayback);endPlayback=null;}
 const variant=clipVariant(visibility),position=video.currentTime||0;
 video.pause();video.controls=true;video.poster=`clips/${id}-${variant}.png`;video.src=`clips/${id}-${variant}.mp4`;video.setAttribute('aria-label',visibilityLabel(visibility)+' animated video preview');
 video.onloadedmetadata=()=>{video.currentTime=Math.min(position,Math.max(0,video.duration-.1));if(play)video.play().catch(()=>{});};video.load();
 };
 const selector=dialog.querySelector('#clip-visibility');
 if(selector){selector.value=d?.visibility||'faces';changeVideo(selector.value);selector.onchange=()=>{changeVideo(selector.value,true);result.textContent=`Preview: ${visibilityLabel(selector.value)}. No access granted by this change.`;};}
 video.addEventListener('timeupdate',()=>{if(video.currentTime>=.5&&!previewed){previewed=true;dialog.querySelectorAll('#approval-buttons button').forEach(b=>b.disabled=false);}});
 dialog.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{
 const choice=b.dataset.choice;if(choice!=='revoke'&&!previewed)return;
 const visibility=selector?.value||'faces';decide(id,choice,visibility);
 changeVideo(['once','repeat'].includes(choice)?visibility:'faces');
 result.textContent=choice==='once'?`Success — ${r.person} can view this clip once · ${visibilityLabel(visibility)}.`:choice==='repeat'?`Success — ${r.person} can view this clip until you revoke access · ${visibilityLabel(visibility)}.`:choice==='deny'?`Request denied. ${r.person} cannot view this clip.`:`Access revoked. ${r.person} cannot view this clip.`;
 });
 dialog.querySelector('#viewer-test')?.addEventListener('click',()=>{
 const visibility=consume(id);if(!visibility){result.textContent='Access denied. A new approval is required.';changeVideo('faces');return;}
 changeVideo(visibility,true);result.textContent=`${r.person} opened this clip · ${visibilityLabel(visibility)}. Actual demo view recorded.`;
 if(state.decisions[id].choice==='once'){video.controls=false;endPlayback=()=>{changeVideo('faces');result.textContent='One-time viewing ended. Another approval is required.';};video.addEventListener('ended',endPlayback,{once:true});}
 });
 dialog.querySelector('#dismiss-sighting')?.addEventListener('click',()=>{log(r,'Sighting dismissed · no camera access');result.textContent='Alert dismissed. Face remains hidden.';});
 dialog.querySelector('#request-consent')?.addEventListener('click',()=>{result.textContent='Waiting for consent review (simulation).';dialog.querySelector('#simulate-consent').hidden=false;});
 dialog.querySelector('#simulate-consent')?.addEventListener('click',()=>{state.consent[id]=true;log(r,'Simulated subject consent recorded');result.textContent='Demo consent approved. No real person or police was contacted.';dialog.querySelector('#show-original').hidden=false;});
 dialog.querySelector('#show-original')?.addEventListener('click',()=>{if(!state.consent[id])return;video.src=`clips/${id}-original.mp4`;video.load();video.play().catch(()=>{});log(r,'Viewed original after simulated subject consent');});
}
const devices=[{id:'omni-s1-pro',name:'Omni S1 Pro',type:'Robot vacuum',battery:88,place:'Living Room',extra:'Docked · Dust bag OK · Mop ready',storage:'Cleaning maps'}, {id:'video-doorbell-e340',name:'Video Doorbell E340',type:'Video doorbell',battery:76,place:'Front Door',extra:'Lens clear · Motion detection on',storage:'8 GB local · demo usage 2.1 GB'}, {id:'eufycam-s3-pro',name:'eufyCam S3 Pro',type:'Security camera',battery:92,place:'Living Room',extra:'HomeBase connected · Lens clear',storage:'HomeBase 3 · demo usage 12 GB'}];
function tabs(active){return `<nav class="native-tabs"><a href="#services" ${active==='insights'?'aria-current="page"':''}>Insights</a><a href="#services/list" ${active==='services'?'aria-current="page"':''}>Services</a></nav>`;}
const intro='<p class="fx-note">Interactive prototype · Device values and storage settings are simulated, not readings from connected products.</p>';
function health(d){return `<article class="fx-card"><div class="fx-row"><h3>${d.name}</h3><span class="badge">Online · Demo</span></div><p>${d.place} · Battery ${d.battery}% · Wi-Fi good</p><progress max="100" value="${d.battery}" aria-label="Demo battery ${d.battery}%"></progress><p>Last sync: 2 minutes ago (demo)</p><p>${d.extra}</p><p>Storage: ${d.storage}</p><a class="eufy-secondary" href="#services/device/${d.id}">Device services</a></article>`;}
export function featureView(app,path){
 if(path==='services'){
 app.className='native-page native-services';app.innerHTML=tabs('insights')+'<h1>Space Status</h1><p class="space-status">2 Spaces | 3 Devices</p>'+intro+`<div class="service-grid"><section><h2>Your devices</h2>${devices.map(d=>`<article class="fx-card"><h3>${d.name}</h3><p>${d.type} · ${d.place}</p><a href="#product/${d.id}">View Product →</a></article>`).join('')}</section><section><h2>Device Health</h2>${devices.map(health).join('')}</section></div>`;return true;
 }
 if(path==='services/list'||path.startsWith('services/device/')){
 const selected=devices.find(d=>path.endsWith('/'+d.id));
 app.className='native-page';app.innerHTML=tabs('services')+`<h1>${selected?selected.name+' services':'Services'}</h1>${intro}<div class="fx-service-grid">${[['Storage & Backup','Choose local storage and cloud backup.','#storage'],['Sightings & Notifications','Preview detections and incoming clip requests.','#sightings'],['Access History','Review actual viewing and approval decisions.','#events/access'],['Viewing permissions','Manage what shared users can see.',selected?.type==='Video doorbell'?'#events/permissions/james':'#events/permissions/emma'],['Privacy settings','Review privacy information and preferences.','#privacy/basics'],['Device Health','Check demo battery, connection and maintenance.','#services']].filter(x=>!selected||selected.type!=='Robot vacuum'||!['Viewing permissions','Access History'].includes(x[0])).map(([title,copy,href])=>`<a class="fx-card" href="${href}"><h3>${title}</h3><p>${copy}</p><span>Open →</span></a>`).join('')}</div>`;return true;
 }
 if(path==='sightings'){
 app.className='native-page';app.innerHTML='<div class="page-heading"><a href="#notifications">‹</a><h1>Sightings & Notifications</h1></div>'+intro+'<p>Detection alerts describe people in footage. Access requests describe people who want to view footage.</p>'+requests.map(card).join('');return true;
 }
 if(path==='storage'){storageView(app,state.storage,save,intro);return true;}

 return false;
}
export function installFeatures(){
 document.addEventListener('click',e=>{
 const clip=e.target.closest('[data-clip]');if(clip){modal(clip.dataset.clip);return;}
 const b=e.target.closest('[data-original]');if(b&&['Cloud Backup','Services'].includes(b.dataset.original)){
 e.preventDefault();e.stopImmediatePropagation();document.querySelector('#close-drawer')?.click();location.hash=b.dataset.original==='Cloud Backup'?'storage':'services/list';
 }
 },true);
}
export function notificationExtras(app){app.insertAdjacentHTML('beforeend',`<section class="fx-section"><h2>Your security notifications</h2><p>Preview a face-masked clip before approving a request.</p>${requests.map(card).join('')}</section>`);}
