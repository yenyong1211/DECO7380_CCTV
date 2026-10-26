import { featureView, installFeatures, notificationExtras, requestCards, decisionHistory } from '../features.js?v=clips-1';
import { shouldShowPrivacyIntro, privacyView, settingsView } from '../privacy.js?v=eufy-9';
import { verificationView, setDemoPermissions } from '../auth.js?v=eufy-9';
import { productView } from '../products.js?v=clips-1';
import { initialiseStartupPermissions } from '../onboarding/permissions.js?v=eufy-9';
import { people, history } from './data.js?v=eufy-9';
import { setupShell, updateShell, nativeView, eventsHeader, bindEventsCalendar, getEventDay, getEventRange } from '../shell.js?v=clips-1';
const app = document.querySelector('#app');
const storageKey = 'cctv.prototype.permissions.v1';
let permissions = {};
try { permissions = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch { /* A blocked storage policy must not prevent using the demo. */ }
setDemoPermissions(permissions);
let day = 21;
const expanded = new Set(['emma']);
const modes = [['original','Original view'],['faces','Hide faces'],['person','Hide whole person'],['none','No access']];
const icon = (name) => ({camera:'<svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2" y="5" width="11" height="10" rx="2" stroke="currentColor"/><path d="m13 8 5-2v8l-5-2" stroke="currentColor"/></svg>',recording:'▤',settings:'☷',lock:'♧',info:'ⓘ'}[name]);
const identity = id => `<span class="avatar">${people[id].initials}</span><span class="person-info"><strong>${people[id].name}</strong><small>${people[id].role}</small></span>`;
function historyView() {
  app.className = 'native-page events-access';
  day = getEventDay();
  document.title = 'eufy · Events · Access History';
  const [from,to]=getEventRange();
  const entries = Object.entries(history[day] || {}).map(([id,events])=>[id,events.filter(event=>event.time>=from&&event.time<=to)]).filter(([,events])=>events.length);
  const visits = entries.reduce((sum,[,events])=>sum+events.length,0);
  const weekday = new Date(2026,9,day).toLocaleDateString('en-US',{weekday:'short'});
  app.innerHTML = `${eventsHeader('history')}<section class="access-content"><header><div class="heading"><h1 tabindex="-1">Access History</h1><span class="badge">Demo data</span></div><p class="subtitle">See who viewed your cameras and recordings</p></header><p class="hint">${icon('info')} Dates show access, not when video was recorded.${from!=='00:00'||to!=='23:59'?` · ${from}–${to}`:''}</p><section aria-label="Visits for selected date"><div class="summary"><strong>${day===21?'Today · ':''}${weekday}, Oct ${day}</strong><span class="muted">${entries.length} ${entries.length===1?'person':'people'}, ${visits} ${visits===1?'visit':'visits'}</span></div>${entries.length?entries.map(([id,events])=>personCard(id,events)).join(''):'<div class="empty">No camera access on this day.<br><br>Choose another date or time range to see visits.</div>'}</section><footer class="footer">${icon('lock')} Only you can see this access history.</footer></section>`;
  app.insertAdjacentHTML('beforeend',requestCards(day)+decisionHistory(day));
  bindEventsCalendar(historyView);
  app.querySelectorAll('[data-expand]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.expand; expanded.has(id)?expanded.delete(id):expanded.add(id); historyView(); app.querySelector(`[data-expand="${id}"]`).focus();}));
}
function currentAccess(id){
 const selected=permissions[id];
 const mode=modes.some(([key])=>key===selected)?selected:people[id].defaultMode;
 const label=modes.find(([key])=>key===mode)[1];
 return `<p class="access-status ${mode==='none'?'blocked':''}"><span class="status-dot" aria-hidden="true"></span>${mode==='none'?'Future access blocked':`Access allowed · ${label}`}<span class="status-caption">Current permission</span></p>`;
}
function personCard(id,events) {
  const count = `${events.length} ${events.length===1?'visit':'visits'}`;
  if(id==='alex')return `<article class="card owner"><div class="person-row">${identity(id)}<span class="visits">${count}<small>${day===21?'today':`Oct ${day}`}</small></span></div></article>`;
  const open = expanded.has(id);
  return `<article class="card"><button class="expand" data-expand="${id}" aria-expanded="${open}" aria-controls="events-${id}" aria-label="${people[id].name}, ${count}, ${open?'collapse':'expand'} visits">${identity(id)}<span class="visits">${count}</span><span class="chevron" aria-hidden="true">${open?'⌃':'⌄'}</span></button>${currentAccess(id)}<p class="last">Last accessed ${events[0].time} · ${events[0].camera}</p><div id="events-${id}" ${open?'':'hidden'} class="events">${events.map(event=>`<div class="event"><span class="event-icon">${icon(event.type==='live'?'camera':'recording')}</span><div>${event.time}&nbsp; Viewed ${event.type==='live'?'live video':'recording'} <span class="visit-allowed">Allowed at visit</span><small>${event.camera}${event.recorded?` · recorded ${event.recorded}`:''}</small></div></div>`).join('')}</div>${day===21?`<button class="permission" data-clip="${id==='emma'?'emma21':'james21'}">View Video</button>`:''}<button class="permission" data-permission="${id}">${icon('settings')}&nbsp; Viewing permissions<span class="sr-only"> for ${people[id].name}</span></button></article>`;
}
function scene(id,mode) {
  return `<div class="scene"><span class="scene-tag">${people[id].name}’s view</span><svg viewBox="0 0 350 216" role="img" aria-label="Illustration of ${people[id].camera}, ${modes.find(m=>m[0]===mode)[1].toLowerCase()}"><rect width="350" height="216" fill="#e6effb"/><path d="M0 145h350v71H0z" fill="#d7e3f3"/><path d="M0 146h350" stroke="#c4d4e9" stroke-width="3"/><rect x="24" y="44" width="82" height="65" rx="5" fill="#fafaf5"/><path d="M30 50h70v53H30z" fill="#d4e4f5"/><path d="M65 48v57m-37-29h74" stroke="#fafaf5" stroke-width="4"/><rect x="26" y="119" width="117" height="44" rx="14" fill="#bacce6"/><rect x="23" y="136" width="123" height="27" rx="9" fill="#d6e2f3"/><rect x="20" y="137" width="17" height="29" rx="6" fill="#a9c0e1"/><rect x="132" y="137" width="17" height="29" rx="6" fill="#a9c0e1"/><path d="M28 164v8m111-8v8" stroke="#35484a" stroke-width="5"/><ellipse cx="228" cy="174" rx="55" ry="9" fill="#c2d2e6"/><path d="M302 148v-31" stroke="#839fbc" stroke-width="4"/><rect x="290" y="146" width="27" height="27" rx="8" fill="#b2c4d9"/><ellipse cx="305" cy="123" rx="10" ry="18" fill="#96b4c9"/><ellipse cx="298" cy="111" rx="8" ry="16" transform="rotate(-25 298 111)" fill="#b3c9d9"/>${mode==='person'?'<rect x="191" y="55" width="78" height="126" rx="19" fill="#c4e4ef" stroke="#5799b4" stroke-dasharray="4 4"/><path d="m222 107 8-4 8 4v9q-8 12-16 0z" fill="none" stroke="#5799b4"/><path d="m226 112 3 3 5-6M211 140h32m-27 9h21" stroke="#8fb6cb" stroke-width="3" stroke-linecap="round"/>':`<g><path d="M217 144v30m21-30v30" stroke="#33444b" stroke-width="12"/><path d="M210 174h14m8 0h14" stroke="#33444b" stroke-width="6" stroke-linecap="round"/><rect x="207" y="101" width="41" height="49" rx="11" fill="#7da9c9"/><path d="m208 109-6 28m45-28 7 27" stroke="#7da9c9" stroke-width="12" stroke-linecap="round"/><circle cx="228" cy="80" r="17" fill="#d4bb9f"/><path d="M212 71q5-17 28-6l4 7" fill="#34464b"/>${mode==='faces'?'<rect x="211" y="68" width="34" height="29" rx="7" fill="#b5d9ec"/><path d="M215 72h8v8h-8zm17 0h8v8h-8zm-9 8h9v8h-9zm-8 8h8v6h-8zm17 0h8v6h-8z" fill="#d8ebf7"/>':'<circle cx="223" cy="79" r="1.3" fill="#34464b"/><circle cx="234" cy="79" r="1.3" fill="#34464b"/><path d="M224 87q5 4 9 0" fill="none" stroke="#977c62"/>'}</g>`}</svg>${mode==='none'?'<div class="scene-blocked"><span aria-hidden="true">⊘</span><strong>No camera access</strong><small>This camera is hidden from this member.</small></div>':''}<span class="scene-caption">Illustration · not real footage</span></div>`;
}
function permissionView(id) {
  app.className = "";
  const person=people[id];
  const stored=permissions[id];
  const mode=modes.some(([key])=>key===stored)?stored:person.defaultMode;
  document.title=`eufy · ${person.name}’s permissions`;
  app.innerHTML=`<nav class="nav"><button class="back" id="back">← Events</button><span>Viewing permissions</span></nav><h1 tabindex="-1">What ${person.name} can see</h1><div class="person-row identity">${identity(id)}</div><p class="camera">${icon('camera')} ${person.camera} Camera</p><div id="preview">${scene(id,mode)}</div><p class="description">Controls ${person.name}’s view of this camera.<br>Applies to future access.</p><fieldset class="choices"><legend class="sr-only">Camera visibility for ${person.name}</legend>${modes.map(([key,label])=>`<label class="choice"><input type="radio" name="visibility" value="${key}" ${mode===key?'checked':''}><span>${label}</span>${key===person.defaultMode?'<span class="badge">Default</span>':''}</label>`).join('')}</fieldset><p class="saved" id="saved">Demo settings are saved on this device only.</p>`;
  document.querySelector('#back').addEventListener('click',()=>{location.hash='events/access';});
  app.querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>{
    permissions[id]=input.value;
    setDemoPermissions(permissions);
    let persisted=true;
    try{localStorage.setItem(storageKey,JSON.stringify(permissions));}catch{persisted=false;}
    document.querySelector('#preview').innerHTML=scene(id,input.value);
    document.querySelector('#saved').textContent=persisted?'Saved on this device · Applies to future demo access.':'Updated for this session · Browser storage is unavailable.';
    announce(`${person.name}: ${modes.find(([key])=>key===input.value)[1]}`);
    app.dispatchEvent(new CustomEvent('cctv:permission-change',{bubbles:true,detail:{personId:id,camera:person.camera,mode:input.value}}));
  }));
}
let noticeTimer;
function announce(message){const notice=document.querySelector('#notice');notice.textContent=message;notice.classList.add('visible');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>notice.classList.remove('visible'),2200);}
function route(){
 const path=location.hash.slice(1)||'home';
 if(shouldShowPrivacyIntro(path)){historyReplacePrivacy();return;}
 updateShell(path);
 const match=path.match(/^(?:history|events)\/permissions\/(emma|james)$/);
 if(path==='privacy'||path.startsWith('privacy/'))privacyView(app,path.split('/')[1]||'');
 else if(path==='privacy-settings'){location.replace('#privacy/basics');return;}
 else if(path==='settings')settingsView(app);
 else if(match)permissionView(match[1]);
 else if(featureView(app,path)){}
 else if(path.startsWith('verify/'))verificationView(app,path.split('/')[1]);
 else if(path.startsWith('product/'))productView(app,path.split('/')[1]);
 else if(path==='history'||path==='events/access')historyView();
 else nativeView(path.startsWith('device/')||['home','events','services','smart','shop','messages','notifications'].includes(path)?path:'home',app);
 if(path==='notifications')notificationExtras(app);
 if(path==='messages')app.insertAdjacentHTML('beforeend','<section class="fx-section"><a class="eufy-secondary" href="#sightings">Sightings & Notifications →</a></section>');
 window.scrollTo(0,0);
}
function historyReplacePrivacy(){window.history.replaceState(null,'','#privacy');route();}
app.addEventListener('click',event=>{const button=event.target.closest('[data-permission]');if(button)location.hash=`events/permissions/${button.dataset.permission}`;});
window.addEventListener('hashchange',()=>{route();app.querySelector('h1')?.focus();});
setupShell();
installFeatures();
window.addEventListener('cctv:clips-updated',()=>{if(location.hash==='#events/access'||location.hash==='#history')historyView();else if(location.hash==='#sightings')featureView(app,'sightings');});
route();
initialiseStartupPermissions({ready:route,announce});
