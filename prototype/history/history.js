import { people, dates, history } from './data.js';
const app = document.querySelector('#app');
const storageKey = 'cctv.prototype.permissions.v1';
let permissions = {};
try { permissions = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch { /* A blocked storage policy must not prevent using the demo. */ }
let day = 19;
const expanded = new Set(['emma']);
const modes = [['original','Original view'],['faces','Hide faces'],['person','Hide whole person'],['none','No access']];
const icon = (name) => ({camera:'<svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2" y="5" width="11" height="10" rx="2" stroke="currentColor"/><path d="m13 8 5-2v8l-5-2" stroke="currentColor"/></svg>',recording:'▤',settings:'☷',lock:'♧',info:'ⓘ'}[name]);
const identity = id => `<span class="avatar">${people[id].initials}</span><span class="person-info"><strong>${people[id].name}</strong><small>${people[id].role}</small></span>`;
function historyView() {
  document.title = 'CCTV · Access History';
  const entries = Object.entries(history[day]);
  const visits = entries.reduce((sum,[,events])=>sum+events.length,0);
  const date = dates.find(d=>d.day===day);
  app.innerHTML = `<header><div class="heading"><h1>Access History</h1><span class="badge">Demo data</span></div><p class="subtitle">See who viewed your cameras and recordings</p></header><section aria-label="Select access date"><div class="range"><span>Recent 7 days including today</span><span class="muted">Oct 2026</span></div><div class="week">${dates.map(d=>`<button class="date" data-day="${d.day}" aria-label="${d.weekday}, October ${d.day}, 2026${d.day===19?', today':''}" aria-pressed="${d.day===day}"><span>${d.weekday}</span><strong>${d.day}</strong><small>${d.day===19?'Today':''}</small></button>`).join('')}</div><p class="hint">${icon('info')} Dates show access, not when video was recorded.</p></section><section aria-label="Visits for selected date"><div class="summary"><strong>${day===19?'Today · ':''}${date.weekday}, Oct ${day}</strong><span class="muted">${entries.length} ${entries.length===1?'person':'people'}, ${visits} ${visits===1?'visit':'visits'}</span></div>${entries.length?entries.map(([id,events])=>personCard(id,events)).join(''):'<div class="empty">No camera access on this day.<br><br>Choose another date to see visits.</div>'}</section><footer class="footer">${icon('lock')} Only you can see this access history.</footer>`;
  app.querySelectorAll('[data-day]').forEach(btn=>btn.addEventListener('click',()=>{day=Number(btn.dataset.day); historyView(); app.querySelector(`[data-day="${day}"]`).focus();}));
  app.querySelectorAll('[data-expand]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.expand; expanded.has(id)?expanded.delete(id):expanded.add(id); historyView(); app.querySelector(`[data-expand="${id}"]`).focus();}));
}
function personCard(id,events) {
  const count = `${events.length} ${events.length===1?'visit':'visits'}`;
  if(id==='alex')return `<article class="card owner"><div class="person-row">${identity(id)}<span class="visits">${count}<small>${day===19?'today':`Oct ${day}`}</small></span></div></article>`;
  const open = expanded.has(id);
  return `<article class="card"><button class="expand" data-expand="${id}" aria-expanded="${open}" aria-controls="events-${id}" aria-label="${people[id].name}, ${count}, ${open?'collapse':'expand'} visits">${identity(id)}<span class="visits">${count}</span><span class="chevron" aria-hidden="true">${open?'⌃':'⌄'}</span></button><p class="last">Last accessed ${events[0].time} · ${events[0].camera}</p><div id="events-${id}" ${open?'':'hidden'} class="events">${events.map(event=>`<div class="event"><span class="event-icon">${icon(event.type==='live'?'camera':'recording')}</span><div>${event.time}&nbsp; Viewed ${event.type==='live'?'live video':'recording'}<small>${event.camera}${event.recorded?` · recorded ${event.recorded}`:''}</small></div></div>`).join('')}</div><button class="permission" data-permission="${id}">${icon('settings')}&nbsp; Viewing permissions<span class="sr-only"> for ${people[id].name}</span></button></article>`;
}
function scene(id,mode) {
  return `<div class="scene"><span class="scene-tag">${people[id].name}’s view</span><svg viewBox="0 0 350 216" role="img" aria-label="Illustration of ${people[id].camera}, ${modes.find(m=>m[0]===mode)[1].toLowerCase()}"><rect width="350" height="216" fill="#e8e6df"/><path d="M0 145h350v71H0z" fill="#d7d4c9"/><path d="M0 146h350" stroke="#c9c8bd" stroke-width="3"/><rect x="24" y="44" width="82" height="65" rx="5" fill="#fafaf5"/><path d="M30 50h70v53H30z" fill="#d3dfd8"/><path d="M65 48v57m-37-29h74" stroke="#fafaf5" stroke-width="4"/><rect x="26" y="119" width="117" height="44" rx="14" fill="#b3c1b7"/><rect x="23" y="136" width="123" height="27" rx="9" fill="#bfcbc0"/><rect x="20" y="137" width="17" height="29" rx="6" fill="#a3b5a7"/><rect x="132" y="137" width="17" height="29" rx="6" fill="#a3b5a7"/><path d="M28 164v8m111-8v8" stroke="#35484a" stroke-width="5"/><ellipse cx="228" cy="174" rx="55" ry="9" fill="#c7c9bc"/><path d="M302 148v-31" stroke="#6e8b77" stroke-width="4"/><rect x="290" y="146" width="27" height="27" rx="8" fill="#afa48f"/><ellipse cx="305" cy="123" rx="10" ry="18" fill="#829c85"/><ellipse cx="298" cy="111" rx="8" ry="16" transform="rotate(-25 298 111)" fill="#a5b59f"/>${mode==='person'?'<rect x="191" y="55" width="78" height="126" rx="19" fill="#bfd4cf" stroke="#64877e" stroke-dasharray="4 4"/><path d="m222 107 8-4 8 4v9q-8 12-16 0z" fill="none" stroke="#64877e"/><path d="m226 112 3 3 5-6M211 140h32m-27 9h21" stroke="#94b4aa" stroke-width="3" stroke-linecap="round"/>':`<g><path d="M217 144v30m21-30v30" stroke="#33444b" stroke-width="12"/><path d="M210 174h14m8 0h14" stroke="#33444b" stroke-width="6" stroke-linecap="round"/><rect x="207" y="101" width="41" height="49" rx="11" fill="#7f9a91"/><path d="m208 109-6 28m45-28 7 27" stroke="#7f9a91" stroke-width="12" stroke-linecap="round"/><circle cx="228" cy="80" r="17" fill="#d4bb9f"/><path d="M212 71q5-17 28-6l4 7" fill="#34464b"/>${mode==='faces'?'<rect x="211" y="68" width="34" height="29" rx="7" fill="#b5cfca"/><path d="M215 72h8v8h-8zm17 0h8v8h-8zm-9 8h9v8h-9zm-8 8h8v6h-8zm17 0h8v6h-8z" fill="#d0dfda"/>':'<circle cx="223" cy="79" r="1.3" fill="#34464b"/><circle cx="234" cy="79" r="1.3" fill="#34464b"/><path d="M224 87q5 4 9 0" fill="none" stroke="#977c62"/>'}</g>`}</svg>${mode==='none'?'<div class="scene-blocked"><span aria-hidden="true">⊘</span><strong>No camera access</strong><small>This camera is hidden from this member.</small></div>':''}<span class="scene-caption">Illustration · not real footage</span></div>`;
}
function permissionView(id) {
  const person=people[id];
  const stored=permissions[id];
  const mode=modes.some(([key])=>key===stored)?stored:person.defaultMode;
  document.title=`CCTV · ${person.name}’s permissions`;
  app.innerHTML=`<nav class="nav"><button class="back" id="back">← History</button><span>Viewing permissions</span></nav><h1 tabindex="-1">What ${person.name} can see</h1><div class="person-row identity">${identity(id)}</div><p class="camera">${icon('camera')} ${person.camera} Camera</p><div id="preview">${scene(id,mode)}</div><p class="description">Controls ${person.name}’s view of this camera.<br>Applies to future access.</p><fieldset class="choices"><legend class="sr-only">Camera visibility for ${person.name}</legend>${modes.map(([key,label])=>`<label class="choice"><input type="radio" name="visibility" value="${key}" ${mode===key?'checked':''}><span>${label}</span>${key===person.defaultMode?'<span class="badge">Default</span>':''}</label>`).join('')}</fieldset><p class="saved" id="saved">Demo settings are saved on this device only.</p>`;
  document.querySelector('#back').addEventListener('click',()=>{location.hash='history';});
  app.querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>{
    permissions[id]=input.value;
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
function route(){const match=location.hash.match(/^#history\/permissions\/(emma|james)$/);match?permissionView(match[1]):historyView();window.scrollTo(0,0);}
app.addEventListener('click',event=>{const button=event.target.closest('[data-permission]');if(button)location.hash=`history/permissions/${button.dataset.permission}`;});
window.addEventListener('hashchange',()=>{route();app.querySelector('h1')?.focus();});
route();
