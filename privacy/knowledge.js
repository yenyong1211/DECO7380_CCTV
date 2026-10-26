import {products, profileFor, detectProduct, defaultProduct, productActions} from './profiles.js?v=products2';
import {history, people} from '../prototype/history/data.js';

// Deliberately bounded exhibit content; no inferred real-account status or external AI.
export const routes = ['events/access','events/permissions/emma','events/permissions/james','device/living-room','device/front-door','services','messages','notifications','agreement','storage','smart','sightings','privacy/basics',...products.flatMap(p=>[`product/${p.id}`,`services/device/${p.id}`])];
export function eufyURL(route, base) {
  if (!routes.includes(route)) throw new Error('Unsupported eufy route');
  const url = new URL('prototype/', base); if (route === 'agreement') return new URL('../agreement/', url).href;
  url.hash = route; return url.href;
}
const action = (route, label, help) => ({route,label,help});
const access = action('events/access','Access History','Review simulated visits. Use the calendar to select a date.');
const permission = id => action(`events/permissions/${id}`,`${id === 'emma' ? 'Emma' : 'James'}’s viewing permissions`,'Choose No access to stop future simulated viewing. Changes are saved in this browser.');
export const rubric = [
  {label:'Support access', points:1, max:2, note:'Illustrative code for conditional manufacturer/support access. Actual support access has not been verified.'},
  {label:'Other-user access', points:1, max:2, note:'The group prototype demonstrates shared viewers and individual permissions. Real-account membership is unknown.'},
  {label:'Cloud recording', points:1, max:2, note:'The example includes an optional cloud path. This does not mean cloud backup is enabled.'},
  {label:'External processing', points:1, max:2, note:'Illustrative assumption for the research scenario. No network traffic or processing location has been measured.'},
  {label:'Secondary video use', points:1, max:2, note:'Illustrative uncertainty code; not a claim that footage is used for training, advertising or any secondary purpose.'}
];
export const controlRubric = [
  {label:'Storage choice',points:2,max:2,note:'Scenario offers local and optional cloud paths. No live storage configuration is read or changed.'},
  {label:'Sharing permissions',points:2,max:2,note:'Existing eufy prototype provides four viewing modes for Emma and James.'},
  {label:'Visibility choices',points:2,max:2,note:'Hide faces, Hide whole person and No access are illustrated in the group prototype. Actual video masking is not performed.'},
  {label:'Access review',points:1,max:2,note:'Access History supports reviewing demo visits. It does not audit an actual account.'},
  {label:'Copy management',points:1,max:2,note:'This platform explains separate local, cloud and exported copies. Deleting real recordings is outside the prototype.'}
];
export const topics = {
  people: {stage:'SEE',title:'See who has access. Decide what they can see.',summary:'In the demo, Emma is linked to the Living Room security camera and James to the Front Door doorbell. Current permissions and past visits answer different questions.',facts:[['Who can see?', 'Open each person’s viewing permissions to inspect their current choice. The original defaults are Hide faces for Emma and Hide whole person for James; earlier changes in this browser may differ.'],['Who has seen?', 'Access History shows simulated live-video and recording visits. An “Allowed at visit” label describes that visit, not their permission now.']],actions:[access,permission('emma'),permission('james')]},
  history: {stage:'REVIEW',title:'Review who accessed your cameras.',summary:'Access History contains seeded demonstration visits plus any verification events generated in this browser. It is not a real account audit.',facts:[['Demo dates','Sample access records are limited to clips with video previews on 21 October 2026. The reference “today” is 21 October, regardless of your device clock.'],['Review in eufy','Open Access History, choose a date with the calendar, and expand a person to see camera, time and visit type.']],actions:[access]},
  storage: {stage:'UNDERSTAND',title:'One recording can have more than one home.',summary:'Storage depends on the camera and configuration. This guide cannot detect whether local storage, HomeBase or cloud backup is enabled.',facts:[['At the camera or hub','The existing eufy privacy guide explains example local storage and HomeBase paths. Check the selected camera’s actual setup in the real app.'],['Cloud and exported copies','Cloud backup, if configured, and deliberately downloaded or shared files are separate copies. Removing someone’s camera permission does not erase copies they already have.'],['What you can explore here','Open a demo camera or Services to inspect the existing prototype. Camera links first require simulated viewer verification; Services is not proof of an active cloud plan.']],actions:[action('device/living-room','Living Room camera','Opens the existing camera flow, including demo verification.'),action('device/front-door','Front Door camera','Opens the existing camera flow, including demo verification.'),action('services','Services','Explore the existing demo service screen; no cloud subscription is changed.')]},
  exposure: {stage:'UNDERSTAND',title:'Why is Data Access Exposure 5/10?',summary:'5/10 is an illustrative researcher-coded exposure rating for this exhibit scenario. Higher values mean more potential exposure under this example rubric. It is not a measured risk probability or official certification.',facts:[['How to read it','Each of five dimensions contributes 0–2 points, for a total of 0–10. The example contributions below add to 5. This newly documented rubric needs the research team’s review before being treated as a study instrument.'],['What it does not do','The rating does not scan devices, verify encryption or track current permissions. It stays at 5/10 when demo permissions change; use eufy to review current choices.']],rubric:true,actions:[permission('emma'),permission('james'),access]},
  control: {stage:'CONTROL',title:'Choose what each person can see.',summary:'Use the existing eufy viewing-permissions controls. Reading this guide does not change access.',facts:[['Choose a viewer','Emma is associated with Living Room; James with Front Door. Select the person below, then choose Original view, Hide faces, Hide whole person or No access.'],['After a change','The eufy prototype saves the setting locally and applies it to future simulated access. Past access records and previously exported copies are not rewritten. Return using your browser’s Back button, then review Access History.']],actions:[permission('emma'),permission('james'),access]},
  alerts: {stage:'REVIEW',title:'Review messages and notification preferences.',summary:'Messages and Notifications are existing eufy prototype screens. They do not send real account alerts or change operating-system permissions.',facts:[['Messages','Inspect the existing messages screen for the demo’s information.'],['Notifications','Review the demo notification preferences. They are separate from camera viewing permissions.']],actions:[action('messages','Messages','Open the existing messages page.'),action('notifications','Notifications','Open the existing notification settings.'),access]}
};
topics.services={stage:'CONTROL',title:'Explore services in the connected eufy prototype.',summary:'Continue to the group’s existing Services page. Cloud backup is a possible storage option, not a confirmed active subscription.',facts:[['What this opens','Services is an existing demo screen. No cloud plan is activated and no recording configuration is changed by this link.']],actions:[action('services','Services','Explore the group prototype’s existing service screen.')]};
topics.support={stage:'UNDERSTAND',title:'Can eufy support see my videos?',summary:'This platform cannot verify support access to a real camera or account. The researcher-coded support-access factor is a scenario example, not evidence of actual access.',facts:[['Separate people from support','Emma and James are simulated shared users, not eufy support staff. Their activity cannot establish what a manufacturer can access.'],['What to verify','Check the applicable product documentation, privacy notice and any support permission request. The existing eufy privacy guide links official material.']],actions:[]};
topics.security={stage:'UNDERSTAND',title:'Encryption needs product-specific evidence.',summary:'This prototype does not inspect network traffic, encryption keys or real video storage. It cannot certify that your recordings are encrypted or that a product is secure.',facts:[['Evidence needed','Check the exact device, firmware, storage path and service documentation. The 5/10 score is not an encryption test.']],actions:[]};
topics.profile={stage:'SEE',title:'Your connected CCTV privacy profile.',summary:'The profile brings together exposure, user control, data flow and evidence for the exhibit scenario. The linked group prototype contains a eufyCam S3 Pro, Video Doorbell E340 and Omni S1 Pro.',facts:[['Information versus action','Explore the profile on this platform. Use Continue in eufy to review visits, change viewing permissions or open a demo camera.']],actions:[access,action('device/living-room','Living Room camera','Opens the existing demo verification and camera flow.')]};
topics.agreement={stage:'UNDERSTAND',title:'Review the new eufy Privacy Agreement.',summary:'The connected eufy demo now starts with an animated privacy explanation before login. It explains collection, storage, sharing and deletion.',facts:[['What you can explore','Follow the animated data journey, pause motion, expand explanations and explore the optional cloud choice. These are demo choices, not real account settings or legal consent.']],actions:[action('agreement','Privacy Agreement','Open the new pre-login privacy explanation in eufy.')]};
function searchBase(question) {
  const q = question.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9\s/-]/g,' ').replace(/\s+/g,' ').trim();
  if (!q) return null;
  if (/\b(agreement|consent|privacy policy|before login|pre login)\b/.test(q)) return {...topics.agreement};
  if (/\b(support|manufacturer)\b/.test(q)) return {...topics.support};
  if (/\b(encryption|encrypted|secure)\b/.test(q)) return {...topics.security};
  if (/\b(service|services)\b/.test(q)) return {...topics.services};
  if (/\b(user control|control score)\b/.test(q)) return {...topics.control,title:'Why is User Control 8/10?',summary:'An illustrative researcher-coded score for available choices in this scenario, not a live measurement.',controlRubric:true};
  if (/\b(eufy|e30|s3 pro|privacy profile)\b/.test(q) && !/\b(why|see|access|stored|storage|stop|remove)\b/.test(q)) return {...topics.profile};
  if (/\b(score|rating|exposure|5\s*\/\s*10|calculated|certification)\b/.test(q)) return {...topics.exposure};
  if (/\b(cloud|backup|storage|recordings|copies)\b/.test(q) && /\b(stop|remove|disable|delete)\b/.test(q)) return {...topics.storage};
  if (/\b(stop|remove|revoke|block|disable|permission|restrict|hide|prevent)\b/.test(q)) {
    const id = /\bjames\b/.test(q) ? 'james' : /\bemma\b/.test(q) ? 'emma' : null;
    return {...topics.control,...(id ? {title:`Change what ${people[id].name} can see.`,actions:[permission(id),access]} : {})};
  }
  if (/\b(yesterday|accessed|history|visits|viewed|watched|logs|last access)\b/.test(q)) {
    if (/\byesterday\b/.test(q)) {
      const entries = Object.entries(history[20] || {}).map(([id,visits])=>`${people[id].name}: ${visits.map(v=>`${v.time}, ${v.type === 'live' ? 'live video' : 'recording'}, ${v.camera}`).join('; ')}`);
      return {...topics.history,title:'Yesterday in the demo: 20 October 2026.',facts:[['Seeded visits for 20 October',entries.length ? entries.join('. ') + '. These are demo records, not real activity.' : 'No video-backed access records for 20 October.'],['Continue to the matching date','Access History opens on the reference today, 21 October. Select 20 October in its calendar (or use the previous-day arrow) to review these visits. No date filter is applied automatically.']]};
    }
    return {...topics.history};
  }
  if (/\b(stored|storage|store|videos|recordings|cloud|backup|delete|retention|download|copies)\b/.test(q)) return {...topics.storage};
  if (/\b(notification|notifications|alerts|messages)\b/.test(q)) return {...topics.alerts};
  if (/\b(living room|front door)\b/.test(q)) {
    const front = q.includes('front door'); return {...topics.people,title:`Explore the ${front ? 'Front Door' : 'Living Room'} camera.`,actions:[action(`device/${front ? 'front-door' : 'living-room'}`,'Camera preview','Continue through existing simulated verification.'),permission(front ? 'james' : 'emma'),access]};
  }
  if (/\b(who|see|seeing|sharing|shared|access|viewers|view)\b/.test(q)) return {...topics.people};
  return {stage:'SEE',title:'Let’s narrow down your privacy question.',summary:'This exhibit uses a small, curated question library. I do not have a verified answer for that question. Try one of the suggestions above or explore a journey stage.',facts:[['Supported topics','People and permissions, access history, storage and copies, exposure ratings, messages and notifications.'],['Need product-specific advice?','Use the official product documentation linked inside the existing eufy privacy guide. This prototype cannot inspect real accounts or answer arbitrary security questions.']],actions:[]};
}

export function search(question, selected=defaultProduct){
 const raw=String(question);if(!raw.trim())return null;
 const q=raw.toLowerCase();let id=detectProduct(raw,selected);
 const explicitDevice=/omni|s1\s*pro|robot|vacuum|e340|doorbell|front door|s3\s*pro|eufycam/.test(q);
 if(!explicitDevice&&/\bjames\b/.test(q))id='video-doorbell-e340';
 if(!explicitDevice&&/\bemma\b/.test(q))id='eufycam-s3-pro';
 const p=profileFor(id), result=searchBase(raw);
 const finish=answer=>({...answer,productId:id});
 const permissionAction=p.person?permission(p.person):null;
 const ownActions=productActions(p),services=ownActions[1];
 const profile={stage:'SEE',view:'profile',title:p.shortName+' · Privacy Profile',summary:p.summary,facts:p.facts,actions:[...(p.preview?[action(p.preview,p.kind==='doorbell'?'Open doorbell':'Open camera','Open this device in the existing eufy demo.')]:[]),...ownActions]};
 if(/\b(agreement|consent|privacy policy|before login|pre login|support|manufacturer|encryption|encrypted|secure)\b/.test(q))return finish(result);
 if(/user control|control score/.test(q))return finish(p.scored?result:{stage:'CONTROL',view:'controls',title:p.shortName+' · Controls',summary:`The supplied research label gives User Control ${p.control}/10. Higher control does not cancel exposure.`,facts:p.facts,actions:[services,ownActions[2]]});
 if(/\b(score|rating|exposure|calculated|certification)\b|5\s*\/\s*10/.test(q))return finish(p.scored?result:{stage:'UNDERSTAND',view:'exposure',title:p.shortName+' · Exposure',summary:`The supplied research label gives ${p.exposure[0]===p.exposure[1]?p.exposure[0]:p.exposure.join('–')}/10. ${p.scoreNote}. This is not official certification.`,facts:[['Evidence',p.factorNotes.join(' ')]],actions:[services]});
 if(/who.*chang|device changes/.test(q))return finish({stage:'REVIEW',view:'review',title:p.shortName+' · Member changes',summary:'Smart records sensing/camera switch changes. Changes by Emma or James generate a demo notification.',facts:p.facts,actions:[ownActions[2],action('notifications','Notifications','Review simulated member changes.')]});
 if(/\b(turn|switch|disable|enable|stop)\b/.test(q)&&/\b(camera|sensing|capture)\b/.test(q)&&!(/emma|james|seeing|shared|permission/.test(q)))return finish({stage:'CONTROL',view:'controls',title:p.shortName+' · Capture controls',summary:p.kind==='vacuum'?'Switch obstacle sensing in the demo; cleaning power is separate.':'Switch camera capture in Smart. Existing recordings and viewing permissions are separate.',facts:p.facts,actions:[ownActions[2],services]});
 if(/\b(stored|storage|store|videos|recordings|cloud|backup|delete|retention|download|copies|maps)\b/.test(q)&&!(/who|accessed|history|watched|yesterday|support|request/.test(q)))return finish({stage:'UNDERSTAND',view:'flow',title:p.shortName+' · Data & storage',summary:p.kind==='vacuum'?'The demo describes obstacle sensing and cleaning maps, not a live video feed.':p.storage+'. Local and cloud copies are separate.',facts:p.facts,actions:p.kind==='vacuum'?[services,ownActions[0]]:[action('storage','Storage & Backup','Household demo settings; not proof of real product compatibility.'),services,action('services','Services','Open the existing household overview.'),...(p.preview?[action(p.preview,'Open '+(p.kind==='doorbell'?'doorbell':'camera'),'Open the device preview.')]:[])]});
 if(/request|allow once|approve|approval|visitor|parcel/.test(q))return finish(p.kind==='vacuum'?{...profile,summary:'No vacuum recording-request flow is implemented. Use sensing controls or device services.'}:{stage:'CONTROL',view:'controls',title:p.shortName+' · Clip requests',summary:'Preview a clip, then choose how the requester may view it in eufy.',facts:[['Scope','Approval applies to the selected recorded clip. It does not grant all-camera access.']],actions:[action('sightings','Clip requests & sightings','Open existing recorded-clip requests.'),permissionAction]});
 if(/\b(stop|remove|revoke|block|permission|restrict|hide|prevent)\b/.test(q)||/who can|who.*see|shared|viewers/.test(q))return finish(p.kind==='vacuum'?{stage:'CONTROL',view:'controls',title:'Omni S1 Pro · Sensing & member changes',summary:'This demo has no live vacuum camera feed or vacuum viewer-permission page.',facts:p.facts,actions:[ownActions[2],services]}:{...result,actions:[...(result.stage==='SEE'?[access]:[]),permissionAction,...(result.stage==='CONTROL'?[access]:[])],facts:p.facts});
 if(/yesterday|accessed|history|visits|viewed|watched|last access/.test(q))return finish(p.kind==='vacuum'?{stage:'REVIEW',view:'review',title:'Review Omni S1 Pro device changes',summary:'Use Smart and Notifications for sensing-switch changes. There is no vacuum video-viewing history in this demo.',facts:p.facts,actions:[ownActions[2],action('notifications','Notifications','Review simulated member device changes.')]}:result);
 if(/service/.test(q))return finish({...result,actions:[services,...result.actions]});
 if(explicitDevice||/privacy profile|e30/.test(q))return finish(profile);
 if(/living room/.test(q))return finish(profile);
 return finish(result);
}
