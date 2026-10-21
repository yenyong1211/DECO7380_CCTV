// Compatibility adapter for existing demo notification preferences.
// The former mandatory five-step startup flow is replaced by privacy.js.
// This adapter never requests OS permissions or accepts an agreement.
export const permissionKey='cctv.prototype.onboarding.v1';
const defaults=()=>({version:1,complete:false,agreement:false,network:'not-set',notifications:false,important:false,previews:'text',analytics:false,email:false,marketing:false});
let saved=defaults();
try{const value=JSON.parse(localStorage.getItem(permissionKey)||'null');if(value?.version===1){for(const key of ['complete','agreement','notifications','important','analytics','email','marketing'])saved[key]=value[key]===true;if(['not-set','all','wifi','none'].includes(value.network))saved.network=value.network;if(['text','thumbnail'].includes(value.previews))saved.previews=value.previews;}}catch{}
export const getStartupPermissions=()=>({...saved});
export const canEnter=()=>true;
export function updateNotificationChoice(key,value){if(!['notifications','important','email','marketing'].includes(key))return;saved[key]=Boolean(value);if(key==='notifications'&&!value)saved.important=false;if(key==='important'&&value)saved.notifications=true;try{localStorage.setItem(permissionKey,JSON.stringify(saved));}catch{}document.dispatchEvent(new CustomEvent('cctv:onboarding-change',{detail:{...saved}}));}
let initialised=false;
export function initialiseStartupPermissions({ready}={}){if(initialised)return;initialised=true;document.addEventListener('click',event=>{const button=event.target.closest('[data-startup-setting]');if(button){const key=button.dataset.startupSetting;updateNotificationChoice(key,!saved[key]);ready?.();}});}
export function renderPermissionSettings(){location.replace('#privacy/basics');}
export function openStartupPermissions(){location.hash='privacy';}
