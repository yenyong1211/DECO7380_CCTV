import {topics, search, rubric, controlRubric, eufyURL} from './knowledge.js';
const result=document.querySelector('#result'),detail=document.querySelector('#detail');
const inputs=[document.querySelector('#question'),document.querySelector('#side-question')];
const stageView={SEE:'profile',UNDERSTAND:'flow',CONTROL:'controls',REVIEW:'review'};
const viewStage={profile:'SEE',exposure:'SEE',controls:'CONTROL',flow:'UNDERSTAND',evidence:'UNDERSTAND',review:'REVIEW'};
const viewNames={profile:'Privacy Profile',exposure:'Data Access Exposure',controls:'User Control',flow:'My Data Flow',evidence:'Evidence & scoring',review:'Access review'};
function el(tag,text,css){const e=document.createElement(tag);if(text)e.textContent=text;if(css)e.className=css;return e;}
function localButton(label,view){const b=el('button',label,'text-button');b.onclick=()=>navigate(view);return b;}
function externalAction(a){const link=el('a',null,'continue');link.href=eufyURL(a.route,document.baseURI);link.append(el('small','Continue in eufy ↗'),el('strong',a.label),el('span',a.help));return link;}
function actions(parent,items){const group=el('div',null,'result-links');items.forEach(a=>group.append(externalAction(a)));parent.append(group);}
function mark(stage,view){document.querySelector('#current-stage').textContent=`${stage} · ${viewNames[view]||'Smart Search'}`;document.querySelectorAll('[data-stage]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.stage===stage)));document.querySelectorAll('[data-view]').forEach(b=>{if(b.dataset.view===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});}
function moveTo(target){target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});const heading=target.querySelector('h2,h3');heading?.focus({preventScroll:true});}
function heading(title,copy){const h=el('h3',title);h.id='detail-title';h.tabIndex=-1;detail.append(h,el('p',copy,'muted'));}
function factorList(rows){const list=el('div',null,'factor-list');rows.forEach(row=>{const item=el('div',null,'factor-row');const copy=el('div');copy.append(el('strong',row.label),el('p',row.note));item.append(copy,el('b',`${row.points}/${row.max}`));list.append(item);});return list;}
function card(title,copy,view,label){const c=el('article',null,'info-card');c.append(el('h4',title),el('p',copy));if(view)c.append(localButton(label||'Explore →',view));return c;}
function renderDetail(view){
 detail.replaceChildren();mark(viewStage[view]||'SEE',view);
 if(view==='profile'){
  heading('Privacy information at a glance','Explore how this example is rated, where video may travel, and which controls you can use.');
  const grid=el('div',null,'overview-grid');grid.append(card('SEE · Data Access Exposure','Five factors explain the 5/10 example rating. Each factor has a reason and an evidence status.','exposure','See the five factors →'),card('UNDERSTAND · My Data Flow','Trace example camera, local hub, optional cloud and app paths. Your live configuration is unknown.','flow','Explore the data flow →'),card('CONTROL · User choices','Review the 8/10 example control score, then open the actual viewing controls in the group prototype.','controls','Find a control →'),card('REVIEW · Access activity','Understand past access separately from current permissions. Use the existing eufy Access History.','review','Review access →'));detail.append(grid);
 }else if(view==='exposure'){
  heading('Data Access Exposure · 5/10','Five researcher-coded example factors, each 1/2. Higher values indicate more potential exposure in the scenario. This is not a probability or certification.');detail.append(factorList(rubric));detail.append(localButton('Inspect evidence & scoring rules →','evidence'));actions(detail,topics.people.actions);
 }else if(view==='controls'){
  heading('User Control · 8/10','A separate researcher-coded example of available choices. Higher is more control. The score stays fixed when demo settings change.');
  const grid=el('div',null,'control-grid');grid.append(card('Manage Emma · Living Room','Choose Original view, Hide faces, Hide whole person or No access in the existing eufy prototype.'),card('Manage James · Front Door','Review the current choice and change future simulated access. Earlier visits remain in Access History.'));detail.append(grid);actions(detail,topics.control.actions);
  const scoring=el('details');scoring.append(el('summary','How the 8/10 example is coded'),factorList(controlRubric));detail.append(scoring);
  detail.append(el('p','Storage and deletion guidance explains options only. This platform does not change a cloud plan, erase recordings or recover previously shared files.','boundary'));
 }else if(view==='flow'){
  heading('My Data Flow','A simplified example, not a live network trace. Local storage and cloud backup are alternative or additional paths depending on setup.');
  const nodes=[['▣','Camera','Captures the scene','A camera can capture video. The group prototype uses illustrations and does not connect to hardware.'],['▤','Local storage / hub','Setup dependent','Local storage may be on a camera or compatible hub. HomeBase availability and compatibility must be checked for the exact device and setup.'],['☁','Optional cloud','Only when configured','A configured cloud service can create a separate copy. This prototype cannot tell whether backup is active. Cloud is not a mandatory step between local storage and the app.'],['▱','App / exported copy','View, download or share','Viewing, deliberately downloading and sharing a file are different actions. Exported copies need separate management; revoking access does not recall files.']];
  const flow=el('div',null,'data-flow'),info=el('div',null,'flow-detail');info.setAttribute('aria-live','polite');function select(n){info.replaceChildren(el('strong',`${n[1]} · `),document.createTextNode(n[3]));flow.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(nodes[i]===n)));}
  nodes.forEach(n=>{const b=el('button',null,'flow-node');b.append(el('b',n[0]),el('strong',n[1]),el('span',n[2]));b.onclick=()=>select(n);flow.append(b);});detail.append(flow,info);select(nodes[0]);detail.append(el('p','Conceptual reading order only: video may stay local, or use optional cloud, while the app can access the configured path.','boundary'));actions(detail,topics.storage.actions);detail.append(localButton('Why does storage affect the rating? →','exposure'));
 }else if(view==='evidence'){
  heading('Evidence & scoring rules','Keep observations, assumptions and unknowns separate. The original conversation supplied example ratings; they are not independently verified product assessments.');
  const list=el('div',null,'evidence-list');
  const records=[['E01 · Group prototype functionality','Observed in source','Permission choices, seeded access visits and camera routes come from the group’s existing implementation. These establish demo functionality only.','https://github.com/yenyong1211/DECO7380_CCTV/tree/main/prototype','Inspect the group prototype source ↗'],['E02 · Exposure rating','Illustrative research code','Support access, other-user access, cloud recording, external processing and secondary video use each contribute 1/2. This restores the five factors discussed in the original design. The research team must validate the coding and product evidence before formal study use.'],['E03 · User Control rating','Illustrative research code','Storage choice 2/2 + sharing permissions 2/2 + visibility choices 2/2 + access review 1/2 + copy management 1/2 = 8/10. These scenario codes describe choices; they do not prove real product safeguards.'],['E04 · Real product and account status','Not verified','Actual storage configuration, support access, processing location, encryption, secondary video use and real account activity are unknown. Follow the official document links in the group prototype’s privacy guide.']];
  records.forEach(([title,status,copy,url,label])=>{const item=el('article');item.append(el('span',status,'status-tag'),el('h4',title),el('p',copy));if(url){const a=el('a',label);a.href=url;a.target='_blank';a.rel='noopener noreferrer';item.append(a);}list.append(item);});detail.append(list);
  const rules=el('details');rules.open=true;rules.append(el('summary','How to read the scores'),el('p','Each dimension uses a 0–2 scale. For exposure: 0 = limited exposure assumed, 1 = conditional or unknown exposure in this example, 2 = broader exposure assumed. For control: 0 = no scenario choice, 1 = partial or guidance-only choice, 2 = an available scenario choice. Unknown exposure is not proof of harmful data use. Totals are illustrative ordinal sums, not calibrated measurements. Scores do not update from local permission state.'));detail.append(rules);
  const guide=el('a','Continue in eufy · Privacy guide ↗','text-button');guide.href=new URL('prototype/#privacy/basics',document.baseURI).href;detail.append(guide);
 }else if(view==='review'){
  heading('Review access in the existing eufy prototype','Review who viewed live video or recordings and when. A past “Allowed at visit” event is different from someone’s current permission.');
  detail.append(card('Demo date context','Seed records cover 15–21 October 2026. The reference today is 21 October, so “yesterday” means 20 October in this exhibit. Select the date after opening Access History.'));
  actions(detail,[...topics.history.actions,...topics.alerts.actions.filter(a=>a.route!=='events/access')]);
 }
}
function renderAnswer(answer){
 result.hidden=false;result.replaceChildren(el('span',`${answer.stage} · SMART SEARCH ANSWER`,'eyebrow'));
 const title=el('h2',answer.title);title.id='result-title';title.tabIndex=-1;result.append(title,el('p',answer.summary,'answer-summary'));
 answer.facts.forEach(([h,p])=>{const f=el('div',null,'fact');f.append(el('h3',h),el('p',p));result.append(f);});
 const links=el('div',null,'result-links');
 const view=answer.rubric?'exposure':answer.controlRubric?'controls':answer===topics.profile?'profile':answer.stage==='UNDERSTAND'?'flow':answer.stage==='CONTROL'?'controls':answer.stage==='REVIEW'?'review':'profile';
 links.append(localButton(`Explore ${viewNames[view]} →`,view),localButton('View evidence & limitations →','evidence'));result.append(links);actions(result,answer.actions);
 result.append(el('p','Continue in eufy opens the connected demo. Use Back to return.','boundary'));
 renderDetail(view);mark(answer.stage,view);
}
function remember(params){const url=new URL(location.href);url.search='';for(const [key,value] of Object.entries(params))url.searchParams.set(key,value);history.pushState(null,'',url);}
function ask(question){question=question.trim().slice(0,300);const answer=search(question);if(!answer)return;inputs.forEach(i=>i.value=question);remember({q:question});renderAnswer(answer);moveTo(result);}
function navigate(view){if(!viewStage[view])view='profile';remember({view});result.hidden=true;renderDetail(view);moveTo(detail);}
document.querySelector('#search-form').onsubmit=e=>{e.preventDefault();ask(inputs[0].value);};document.querySelector('#side-search').onsubmit=e=>{e.preventDefault();ask(inputs[1].value);};
document.querySelectorAll('[data-query]').forEach(b=>b.onclick=()=>ask(b.dataset.query));document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>navigate(b.dataset.view));
document.querySelectorAll('[data-stage]').forEach(b=>b.onclick=()=>{if(b.dataset.stage==='ASK'){mark('ASK');moveTo(document.querySelector('.search-hero'));inputs[0].focus();}else navigate(stageView[b.dataset.stage]);});
function restore(){const p=new URLSearchParams(location.search);inputs.forEach(i=>i.value=p.get('q')||'');const answer=search(inputs[0].value);if(answer)renderAnswer(answer);else{result.hidden=true;renderDetail(viewStage[p.get('view')]?p.get('view'):'profile');}}
window.addEventListener('popstate',restore);restore();
