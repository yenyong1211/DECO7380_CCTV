/* Eufy-inspired coursework flow. All permissions below are simulated choices.
   This module never calls Notification.requestPermission or a device API. */
export const permissionKey = 'cctv.prototype.onboarding.v1';
const defaults = () => ({version:1,complete:false,agreement:false,network:'not-set',notifications:false,important:false,previews:'text',analytics:false,email:false,marketing:false});
let saved = defaults();
try {
 const value = JSON.parse(localStorage.getItem(permissionKey) || 'null');
 if(value && value.version===1) {
  for(const key of ['complete','agreement','notifications','important','analytics','email','marketing']) saved[key]=value[key]===true;
  if(['not-set','all','wifi','none'].includes(value.network))saved.network=value.network;
  if(['text','thumbnail'].includes(value.previews))saved.previews=value.previews;
  saved.complete = saved.complete && saved.agreement && saved.network!=='not-set';
  if(!saved.notifications)saved.important=false;
 }
} catch { /* Private browsing or invalid storage falls back to fresh setup. */ }
let draft={...saved},step=0,dialog,content,info,callbacks={},persisted=true,returnFocus=null,reviewing=false;
const labels=['Agreement','Network access','Notifications','Important alerts','Privacy choices','Review'];
const networkLabel = key => ({all:'Wi-Fi & Mobile Data',wifi:'Wi-Fi Only',none:"Don't Allow",'not-set':'Not set'}[key]);
const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const glyph = name => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${{shield:'<path d="m12 2-8 3v6c0 6 8 11 8 11s8-5 8-11V5z"/><path d="m8 12 3 3 5-6"/>',network:'<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8 16a6 6 0 0 1 8 0"/><circle cx="12" cy="20" r="1"/>',bell:'<path d="M5 17h14l-2-4V8a5 5 0 0 0-10 0v5zM10 21h4"/>',alert:'<path d="m12 3 10 18H2zM12 9v5M12 17h.01"/>',check:'<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>',settings:'<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2" fill="white"/><circle cx="16" cy="12" r="2" fill="white"/><circle cx="8" cy="18" r="2" fill="white"/>'}[name]}</svg>`;
const btn=(text,action,kind='primary')=>`<button class="ob-button ob-${kind}" data-ob="${action}">${text}</button>`;
const links=`<a href="https://www.eufy.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer">Official eufy Privacy Policy ↗</a>`;
export const canEnter = () => saved.complete && saved.agreement;
export const getStartupPermissions = () => ({...saved});
function persist(){persisted=true;try{localStorage.setItem(permissionKey,JSON.stringify(saved));}catch{persisted=false;}document.dispatchEvent(new CustomEvent('cctv:onboarding-change',{detail:{...saved}}));}
function openInfo(type){
 const details={agreement:['User Agreement',`<p>You are using a university coursework prototype inspired by the eufy interface. Its cameras, recordings and permission prompts are demonstrations.</p><p>Selecting “Agree and Continue” records agreement to proceed with this demonstration only. It does not create an eufy account or accept an official eufy contract.</p><p>You can decline and remain outside the prototype. Optional data-use and notification choices can be changed later.</p>`],privacy:['Privacy Notice',`<p>The prototype stores your selected preferences and demo viewing-permission settings in this browser. It does not upload camera footage, send notifications or contact a camera.</p><p>Optional usage analytics are off by default and remain a saved preference only; no analytics service is connected. Thumbnail preferences do not upload any image in this demo.</p><p>For information about the actual eufy service, read the external policy:</p><p>${links}</p>`]};
 const [title,body]=details[type];info.hidden=false;content.hidden=true;info.innerHTML=`<h2 id="ob-info-title" tabindex="-1">${title}</h2><div class="ob-copy">${body}</div>${btn('Back to setup','info-back','secondary')}`;dialog.setAttribute('aria-labelledby','ob-info-title');info.querySelector('h2').focus();
}
const confirmed = new Set();
const topicMeta = [
 ['shield','Understand','Agreement & privacy','Read the essentials before you decide.'],
 ['network','Connect','Network access','Choose your connection preference.'],
 ['bell','Receive','Notifications','Decide how you hear about activity.'],
 ['alert','Prioritise','Important alerts','Give security events extra attention.'],
 ['settings','Choose','Privacy preferences','Control previews and optional data use.'],
 ['check','Confirm','Review & finish','Check every choice before entering.']
];
function statusFor(i){
 if(!confirmed.has(i))return reviewing?'Review saved choice':'Not confirmed yet';
 return [draft.agreement?'Agreement accepted':'Not accepted',networkLabel(draft.network),draft.notifications?'Notifications allowed':'Notifications off',draft.important?'Important alerts on':'Important alerts off',`${draft.previews==='text'?'Text only':'Thumbnail previews'} · Analytics ${draft.analytics?'on':'off'}`,'Ready'][i];
}
function flowPath(){return `<svg class="ob-flow-lines" viewBox="0 0 500 646" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="ob-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7z" fill="#213851"/></marker></defs>${Array.from({length:5},(_,i)=>{const a=i%2===0?325:175,b=i%2===0?175:325,y=i*112+82;return `<path d="M${a} ${y} C${a} ${y+17} ${b} ${y+13} ${b} ${y+30}" marker-end="url(#ob-arrow)"/>`;}).join('')}</svg>`;}
function renderMap(){
 info.hidden=true;content.hidden=false;dialog.classList.add('ob-map-view');dialog.setAttribute('aria-labelledby','ob-title');
 const count=confirmed.size,ready=[0,1,2,3,4].every(i=>confirmed.has(i)),nextIndex=[0,1,2,3,4].find(i=>!confirmed.has(i))??5;
 content.innerHTML=`<div class="ob-hub-head"><div class="ob-hub-brand">${glyph('shield')}<span>eufy <small>Privacy setup</small></span></div>${reviewing?'<button class="ob-inline" data-ob="cancel-review">Cancel review</button>':'<span class="ob-hub-label">Before your first visit</span>'}</div><div class="ob-hub-layout"><section class="ob-hub-intro"><p class="ob-kicker">UNDERSTAND. CHOOSE. CONFIRM.</p><h1 id="ob-title" tabindex="-1">Your privacy choices,<br><em>made clear.</em></h1><p class="ob-lead">Follow the connected steps. Open each card, explore the information, and confirm what works for you.</p><div class="ob-hub-picture" role="img" aria-label="Camera connects through your network to your privacy choices"><span>${glyph('shield')}<small>Your choices</small></span><div><i>${glyph('network')}</i><b>→</b><i>${glyph('settings')}</i><b>→</b><i>${glyph('check')}</i></div><p>Understand first. Then decide.</p></div><div class="ob-hub-progress"><strong>${count} of 5 choices confirmed</strong><span>${ready?'Ready for your final review':'Your progress stays here while you explore'}</span><div class="ob-hub-segments" aria-label="${count} of 5 choices confirmed">${[0,1,2,3,4].map(i=>`<i class="${confirmed.has(i)?'done':''}"></i>`).join('')}</div></div>${btn(ready?'Review & Confirm':count?'Continue with '+labels[nextIndex]:'Start with Agreement','open-'+nextIndex)}<p class="ob-footnote">Choosing “Don’t Allow” is still a valid confirmation. Optional permissions can stay off.</p><details class="ob-hub-details"><summary>About this prototype</summary><p>These are demonstration preferences saved in this browser. No real camera, notification delivery, or device permission is connected.</p></details></section><section class="ob-flow-region" aria-label="Clickable privacy setup journey">${flowPath()}${topicMeta.map((m,i)=>`<button class="ob-flow-node ${i%2?'left':'right'} ${confirmed.has(i)?'confirmed':''} ${i===5?'final':''}" style="--node-top:${i*112}px" data-ob="open-${i}" aria-label="Step ${i+1}: ${m[2]}, ${i===5?(ready?'ready for final review':'review remaining choices'):statusFor(i)}"><span class="ob-node-index">0${i+1}</span><span class="ob-node-icon">${glyph(confirmed.has(i)?'check':m[0])}</span><span class="ob-node-copy"><small>${confirmed.has(i)?'Confirmed':m[1]}</small><strong>${m[2]}</strong><span>${i===5?(ready?'All choices ready':'Review your choices'):statusFor(i)}</span></span><span class="ob-node-chevron" aria-hidden="true">›</span></button>`).join('')}</section></div><div class="ob-prototype-label">Coursework prototype · Eufy-inspired web journey · Select any step to explore</div>`;
 dialog.scrollTop=0;content.querySelector('#ob-title').focus();
}
function confirmStep(i){confirmed.add(i);step=-1;renderMap();const next=content.querySelector(`[data-ob="open-${i<4?i+1:5}"]`);next?.focus();}
function stepVisual(i){
 const block=(name,title,caption)=>`<div class="ob-visual-stop"><span>${glyph(name)}</span><strong>${title}</strong><small>${caption}</small></div>`;
 const row=(parts)=>`<div class="ob-visual-sequence">${parts.map((p,j)=>`${j?'<b aria-hidden="true">→</b>':''}${block(...p)}`).join('')}</div>`;
 const graphics=[
 row([['shield','Read','Know the essentials'],['settings','Choose','Your decision'],['check','Confirm','Continue when ready']]),
 row([['network','Your network','Wi-Fi / mobile data'],['shield','Camera services','Connection preference']]),
 `<div class="ob-alert-demo"><div class="ob-alert-demo-icon">${glyph('bell')}</div><div><span>EXAMPLE NOTIFICATION</span><strong>Motion detected</strong><p>Front entrance · Activity near your home</p></div><small>Illustrative preview</small></div>`,
 `<div class="ob-alert-demo important"><div class="ob-alert-demo-icon">${glyph('alert')}</div><div><span>EXAMPLE SECURITY EVENT</span><strong>Camera offline</strong><p>Check the connection to your device.</p></div><small>Illustrative preview</small></div>`,
 `<div class="ob-preview-compare"><div>${glyph('bell')}<strong>Text only</strong><span>Motion detected</span><small>No preview image</small></div><div>${glyph('shield')}<strong>With thumbnail</strong><span class="ob-thumbnail-art">${glyph('network')}</span><small>Preview may use cloud processing</small></div></div>`,
 row([['shield','Your choices','Review each preference'],['check','Your workspace','Enter after confirmation']])
 ];
 return `<div class="ob-step-visual" aria-label="Illustrated explanation">${graphics[i]}</div>`;
}

function go(next){step=Math.max(-1,Math.min(5,next));render();}
function render(){
 if(step===-1){renderMap();return;}
 dialog.classList.remove('ob-map-view');
 info.hidden=true;content.hidden=false;dialog.setAttribute('aria-labelledby','ob-title');
 const head=(icon,title,desc)=>`<p class="ob-kicker">BEFORE YOU GET STARTED · ${step+1} OF 6</p><h1 id="ob-title" tabindex="-1">${title}</h1><p class="ob-lead">${desc}</p>${stepVisual(step)}`;
 let body='';
 if(step===0)body=head('shield','User Agreement & Privacy Notice','Please review the information below before using your CCTV workspace.')+`<div class="ob-copy"><p>This prototype demonstrates how connected cameras and their services work. Understanding privacy comes before using your cameras.</p><p>Read the ${'<button class="ob-inline" data-ob="agreement-info">User Agreement</button>'} and ${'<button class="ob-inline" data-ob="privacy-info">Privacy Notice</button>'} before continuing. This summary introduces the demonstration and does not replace the official eufy policies.</p><p>If you do not agree, you can leave setup without entering the prototype.</p></div><div class="ob-actions">${btn('Disagree and Exit','decline','secondary')}${btn('Agree and Continue','agree')}</div>`;
 if(step===1)body=head('network','Allow Network Access?','Choose how you would like to connect to your camera services.')+`<div class="ob-callout">Remote live view and cloud features normally require an internet connection. With network access disabled, some features may be unavailable.</div><div class="ob-stack">${btn('Wi-Fi & Mobile Data','network-all')}${btn('Wi-Fi Only','network-wifi','secondary')}${btn("Don't Allow",'network-none','quiet')}</div><p class="ob-footnote">App-style demonstration: a website cannot control your device’s Wi-Fi or mobile-data permissions. This choice does not restrict this browser’s network access.</p>`;
 if(step===2)body=head('bell','Allow Notifications?','Stay informed about activity around your home.')+`<div class="ob-feature"><span>${glyph('bell')}</span><div><strong>Motion and device alerts</strong><p>In the eufy app, notifications can inform you about detected motion, doorbell activity and device status, depending on the device and settings.</p></div></div><div class="ob-actions">${btn("Don't Allow",'notifications-no','secondary')}${btn('Allow Notifications','notifications-yes')}</div><p class="ob-footnote">This is a demo preference. No browser permission request or real notification will be sent.</p>`;
 if(step===3)body=head('alert','Important Security Alerts','Choose whether important security events should receive extra attention in your notification preferences.')+`<div class="ob-callout"><strong>Keep essential events visible</strong><p>Examples include a triggered alarm or a device going offline. Alert availability depends on the actual device and app configuration.</p></div>${!draft.notifications?'<p class="ob-warning">Notifications are currently off. To enable important alerts, notification delivery must also be enabled. You can keep both off.</p>':''}<div class="ob-actions">${btn('Not Now','important-no','secondary')}${btn(draft.notifications?'Enable Important Alerts':'Enable Notifications & Alerts','important-yes')}</div><p class="ob-footnote">Web adaptation, not iOS Critical Alerts. This prototype cannot override Silent Mode, Focus or Do Not Disturb.</p>`;
 if(step===4)body=head('settings','Choose Your Privacy Preferences','Review optional choices before entering your workspace.')+`<fieldset class="ob-fieldset"><legend>Notification content</legend><label class="ob-radio"><input type="radio" name="ob-previews" value="text" ${draft.previews==='text'?'checked':''}><span><strong>Text only</strong><small>Keep preview images out of notifications.</small></span></label><label class="ob-radio"><input type="radio" name="ob-previews" value="thumbnail" ${draft.previews==='thumbnail'?'checked':''}><span><strong>Include thumbnail</strong><small>In the actual eufy service, thumbnail notifications can require temporarily hosting preview images in the cloud.</small></span></label></fieldset><label class="ob-toggle"><span><strong>Share usage analytics</strong><small>Optional · Off by default. This demo does not send analytics.</small></span><input type="checkbox" id="ob-analytics" ${draft.analytics?'checked':''}></label><div class="ob-actions">${btn('Back to Journey','map','secondary')}${btn('Confirm Privacy Choices','next')}</div>`;
 if(step===5)body=head('check','Ready to Continue','Here is a summary of the choices you have made.')+`${[0,1,2,3,4].every(i=>confirmed.has(i))?'':`<div class="ob-warning">Please open and confirm these steps first: ${[0,1,2,3,4].filter(i=>!confirmed.has(i)).map(i=>`<button class="ob-inline" data-ob="open-${i}">${escape(labels[i])}</button>`).join(', ')}.</div>`}<dl class="ob-receipt"><div><dt>Agreement</dt><dd>${draft.agreement?'Reviewed and accepted for this demo':'Not confirmed'}</dd></div><div><dt>Network access</dt><dd>${networkLabel(draft.network)}</dd></div><div><dt>Notifications</dt><dd>${draft.notifications?'Allowed':'Not allowed'}</dd></div><div><dt>Important alerts</dt><dd>${draft.important?'Enabled':'Off'}</dd></div><div><dt>Notification content</dt><dd>${draft.previews==='text'?'Text only':'Include thumbnail'}</dd></div><div><dt>Usage analytics</dt><dd>${draft.analytics?'Enabled':'Off'}</dd></div></dl><p class="ob-footnote">You can revisit these choices in Settings → Privacy & Permissions.</p><div class="ob-actions">${btn('Back to Journey','map','secondary')}<button class="ob-button ob-primary" data-ob="finish" ${[0,1,2,3,4].every(i=>confirmed.has(i))?'':'disabled'}>Confirm & Enter Workspace</button></div>`;
 content.innerHTML=`<button class="ob-back" data-ob="map">← Back to visual journey</button><div class="ob-steps" aria-label="Setup steps">${labels.map((s,i)=>`<button class="${i===step?'current':confirmed.has(i)?'done':''}" data-ob="open-${i}" ${i===step?'aria-current="step"':''}>${escape(s)}</button>`).join('')}</div>${body}<div class="ob-prototype-label">Coursework prototype · Eufy-inspired flow · Choices stay in this browser</div>`;
 dialog.scrollTop=0;content.querySelector('#ob-title')?.focus();
}
export function openStartupPermissions(){
 returnFocus=document.activeElement;reviewing=canEnter();draft={...saved};confirmed.clear();step=-1;render();if(!dialog.open)dialog.showModal();content.querySelector('#ob-title').focus();
}
function finish(){if(!draft.agreement||![0,1,2,3,4].every(i=>confirmed.has(i))){go(5);return;}saved={...draft,version:1,complete:true,agreement:true};persist();dialog.close();callbacks.ready?.();document.querySelector('#app h1')?.focus();if(!persisted)callbacks.announce?.('Saved for this session only. Browser storage is unavailable.');}
function settingsPage(app){
 app.className='native-page native-permission-settings';document.title='eufy · Privacy & Permissions';
 app.innerHTML=`<div class="page-heading"><a href="#home" aria-label="Back to Home">‹</a><h1 tabindex="-1">Privacy & Permissions</h1></div><p class="ob-settings-intro">Your saved choices for this coursework prototype. These settings do not change real eufy or operating-system permissions.</p><div class="ob-settings-grid"><section class="ob-settings-card"><h2>Startup permissions</h2><dl class="ob-receipt"><div><dt>Network access</dt><dd>${networkLabel(saved.network)}</dd></div><div><dt>Notifications</dt><dd>${saved.notifications?'Allowed':'Not allowed'}</dd></div><div><dt>Important alerts</dt><dd>${saved.important?'Enabled':'Off'}</dd></div><div><dt>Notification content</dt><dd>${saved.previews==='text'?'Text only':'Include thumbnail'}</dd></div><div><dt>Usage analytics</dt><dd>${saved.analytics?'Enabled':'Off'}</dd></div></dl><button class="ob-button ob-primary" data-startup-review>Review Permission Choices</button></section><section class="ob-settings-card"><h2>In your control</h2><p>Use Events → Access History to review who viewed your cameras and adjust each member’s viewing permissions.</p><a class="ob-link-button" href="#events/access">Open Access History →</a><p>${links}</p><p class="ob-footnote">${persisted?'Preferences are stored in this browser only.':'Browser storage is unavailable. Preferences last for this session only.'}</p></section></div>`;
}
export function renderPermissionSettings(app){settingsPage(app);}
export function updateNotificationChoice(key,value){
 if(!['notifications','important','email','marketing'].includes(key))return;
 saved[key]=Boolean(value);if(key==='notifications'&&!value)saved.important=false;
 if(key==='important'&&value)saved.notifications=true;
 persist();
}
export function initialiseStartupPermissions(options){
 callbacks=options;
 dialog=document.createElement('dialog');dialog.id='startup-permissions';dialog.className='ob-dialog';dialog.setAttribute('aria-labelledby','ob-title');dialog.innerHTML='<div id="ob-content"></div><section id="ob-info" hidden></section>';
 document.body.append(dialog);content=dialog.querySelector('#ob-content');info=dialog.querySelector('#ob-info');
 dialog.addEventListener('cancel',event=>{event.preventDefault();if(!info.hidden){render();return}if(step!==-1){go(-1);return;}if(reviewing){dialog.close();returnFocus?.focus();}else{callbacks.announce?.('Choose Disagree and Exit to leave setup, or continue reviewing your choices.');}});
 dialog.addEventListener('click',event=>{
  const action=event.target.closest('[data-ob]')?.dataset.ob;if(!action)return;
  if(action==='map'){go(-1);return;}
  if(action.startsWith('open-')){go(Number(action.slice(5)));return;}
  if(action==='cancel-review'){dialog.close();returnFocus?.focus();return;}
  if(action==='agreement-info'||action==='privacy-info'){openInfo(action.split('-')[0]);return}
  if(action==='info-back'){render();return}
  if(action==='decline'&&reviewing){dialog.close();returnFocus?.focus();callbacks.announce?.('Review cancelled. Your saved choices were kept.');return;}
  if(action==='decline'){content.innerHTML=`<div class="ob-symbol">${glyph('shield')}</div><h1 id="ob-title" tabindex="-1">Setup Paused</h1><p class="ob-lead">You have not agreed to continue with this demo setup. The workspace remains unavailable until you agree.</p>${btn('Return to Agreement','restart','secondary')}<p class="ob-footnote">No account was created and no data was sent.</p>`;content.querySelector('h1').focus();return}
  if(action==='restart'){go(0);return}
  if(action==='agree'){draft.agreement=true;confirmStep(0);return}
  if(action.startsWith('network-')){draft.network=action.slice(8);confirmStep(1);return}
  if(action.startsWith('notifications-')){draft.notifications=action.endsWith('yes');if(!draft.notifications&&draft.important){draft.important=false;confirmed.delete(3);}confirmStep(2);return}
  if(action.startsWith('important-')){draft.important=action.endsWith('yes');if(draft.important&&!draft.notifications){draft.notifications=true;confirmed.delete(2);}confirmStep(3);return}
  if(action==='back'){go(step-1);return}
  if(action==='next'){confirmStep(4);return}
  if(action==='review'){go(1);return}
  if(action==='finish'){finish();}
 });
 dialog.addEventListener('change',event=>{if(event.target.name==='ob-previews'){draft.previews=event.target.value;confirmed.delete(4);}if(event.target.id==='ob-analytics'){draft.analytics=event.target.checked;confirmed.delete(4);}});
 document.addEventListener('click',event=>{
  if(event.target.closest('[data-startup-review]'))openStartupPermissions();
  const toggle=event.target.closest('[data-startup-setting]');
  if(toggle){const key=toggle.dataset.startupSetting;updateNotificationChoice(key,!saved[key]);callbacks.ready?.();}
 });
 if(!canEnter())openStartupPermissions();
}
