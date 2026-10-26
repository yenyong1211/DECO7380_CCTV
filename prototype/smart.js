import { productThumbnail } from './products.js?v=three-devices-7';
export const smartDevices=[{id:'omni-s1-pro',name:'Omni S1 Pro',place:'Living Room',note:'Camera sensing control only; cleaning power is separate.'},{id:'video-doorbell-e340',name:'Video Doorbell E340',place:'Front Door',note:'Doorbell camera capture.'},{id:'eufycam-s3-pro',name:'eufyCam S3 Pro',place:'Living Room',note:'Security camera capture.'}];
const key='cctv.prototype.smart-controls.v1',members={ann:'ANN (You)',emma:'Emma',james:'James'};
const initial=()=>({cameras:Object.fromEntries(smartDevices.map(d=>[d.id,true])),logs:[]});
let state=initial();
function read(){try{const value=JSON.parse(localStorage.getItem(key)||'null');if(value)state={cameras:{...initial().cameras,...value.cameras},logs:Array.isArray(value.logs)?value.logs:[]};}catch{}return state;}
function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch{}}
const dateParts=at=>new Intl.DateTimeFormat('en-AU',{timeZone:'Australia/Brisbane',day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(at));
export function changeCamera(id,on,actor='ann'){
 read();if(!smartDevices.some(d=>d.id===id)||!Object.hasOwn(members,actor)||typeof on!=='boolean'||state.cameras[id]===on)return null;
 state.cameras[id]=on;const event={id:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8),device:id,on,actor,at:new Date().toISOString(),reviewed:actor==='ann'};state.logs.unshift(event);state.logs=state.logs.slice(0,100);save();return event;
}
export function cameraEnabled(id){return read().cameras[id]!==false;}
export function smartAlertsContent(){
 const logs=read().logs.filter(l=>l.actor!=='ann');if(!logs.length)return '';
 return `<section class="fx-section"><h2>Device on/off notifications</h2>${logs.map(l=>{const d=smartDevices.find(d=>d.id===l.device);if(!d)return '';return `<article class="fx-card"><div class="fx-row"><h3>${members[l.actor]} turned ${l.on?'on':'off'} ${d.name}</h3><span class="badge">${l.reviewed?'Reviewed':'New'}</span></div><p>${dateParts(l.at)} · ${d.place} · Demo</p><p>${l.on?'Camera capture was switched on.':'Camera capture was switched off. Check this change if you did not expect it.'}</p><a class="eufy-secondary" href="#smart">Review device controls</a></article>`;}).join('')}</section>`;
}
function announce(event){
 if(!event||event.actor==='ann')return;const d=smartDevices.find(d=>d.id===event.device),notice=document.querySelector('#notice');if(notice){notice.textContent=`${members[event.actor]} turned ${event.on?'on':'off'} ${d.name}. Review this change in Smart.`;notice.classList.add('visible');setTimeout(()=>notice.classList.remove('visible'),8000);}
}
export function smartView(app){
 let actor='ann';
 const render=()=>{read();app.className='native-page native-smart';app.innerHTML=`<h1>Smart</h1><p>Switch your device cameras on or off.</p><p class="fx-note">Interactive prototype · No real devices are controlled. Switching off capture does not delete saved videos or revoke viewing permissions.</p><label class="fx-field">Demo operator <select id="smart-actor"><option value="ann">ANN (You)</option><option value="emma">Emma</option><option value="james">James</option></select></label><p class="fx-note">Choose Emma or James to simulate another member changing a camera. Both on and off changes notify ANN.</p><div class="fx-service-grid">${smartDevices.map(d=>`<article class="fx-card"><div class="fx-row"><div><h2>${d.name}</h2><p>${d.place}</p></div><div class="smart-product">${productThumbnail(d.id)}</div></div><label class="storage-toggle-row"><span><strong>Camera ${state.cameras[d.id]?'On':'Off'}</strong><small>${d.note}</small></span><span class="storage-switch"><input type="checkbox" role="switch" aria-label="${d.name} camera" data-smart-camera="${d.id}" ${state.cameras[d.id]?'checked':''}><span class="storage-switch-track" aria-hidden="true"></span></span></label></article>`).join('')}</div><p id="smart-result" role="status" aria-live="polite"></p><section class="fx-section"><div class="fx-row"><h2>Device changes</h2><a href="#notifications">Notifications →</a></div><div id="smart-log">${state.logs.length?state.logs.map(l=>{const d=smartDevices.find(d=>d.id===l.device);if(!d)return '';return `<article class="fx-card"><h3>${members[l.actor]} turned ${l.on?'on':'off'} ${d.name}</h3><p>${dateParts(l.at)} · Demo</p>${l.actor!=='ann'?`<p>${l.reviewed?'Reviewed by you':'Notification sent to ANN in this prototype'}</p>${l.reviewed?'':`<button class="eufy-secondary" data-smart-review="${l.id}">Mark as reviewed</button>`}`:''}</article>`;}).join(''):'<p>No device changes yet.</p>'}</div></section>`;
 app.querySelector('#smart-actor').value=actor;app.querySelector('#smart-actor').onchange=e=>{actor=e.target.value;};
 app.querySelectorAll('[data-smart-camera]').forEach(input=>input.onchange=()=>{const id=input.dataset.smartCamera;const event=changeCamera(id,input.checked,actor);render();const d=smartDevices.find(d=>d.id===id);app.querySelector('#smart-result').textContent=`${d.name} camera ${cameraEnabled(id)?'On':'Off'} · Saved.${actor!=='ann'?' ANN has been notified.':''}`;app.querySelector(`[data-smart-camera="${id}"]`).focus();announce(event);});
 app.querySelectorAll('[data-smart-review]').forEach(button=>button.onclick=()=>{read();const event=state.logs.find(l=>l.id===button.dataset.smartReview);if(event){event.reviewed=true;save();render();app.querySelector('#smart-result').textContent='Device change reviewed.';}});
 };render();
}
export function installSmart(){window.addEventListener('storage',event=>{if(event.key===key){const latest=read().logs[0];announce(latest);if(location.hash==='#smart')smartView(document.querySelector('#app'));}});}
