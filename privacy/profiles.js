import {catalog} from '../prototype/products.js';

// Product facts below describe the group's demo, not a verified real account.
const definitions = {
 'eufycam-s3-pro':{shortName:'eufyCam S3 Pro',icon:'camera',place:'Living Room',purpose:'Security video',data:'Video & recordings',storage:'HomeBase 3 · demo setup',person:'emma',personName:'Emma',preview:'device/living-room',scored:true,exposure:[5,5],control:8,scoreNote:'Historical study label · 21 Sep 2026 · Not re-scored',
  summary:'A security camera for live viewing and recorded clips in the demo.',
  facts:[['Capture','Illustrated security footage and recorded clips.'],['Storage','The supplied label lists local HomeBase 3 with optional cloud. The real configuration is not read.'],['Support & deletion','The supplied label describes permission-based support access and deletion of recordings. It is a research reference, not verified account status.']],
  factorNotes:['Support access is not verified for this device or account.','Emma has a demonstrated viewing-permission page. Check its current choice in eufy.','The demo has optional household cloud storage. No active real plan is detected.','Processing location and encryption are not measured by this platform.','Downloaded copies are separate. Secondary uses of real footage are not verified.']},
 'video-doorbell-e340':{shortName:'Video Doorbell E340',icon:'doorbell',place:'Front Door',purpose:'Doorbell video',data:'Visitors & parcel clips',storage:'8 GB local · optional HomeBase',person:'james',personName:'James',preview:'device/front-door',scored:false,exposure:[4,6],control:7,scoreNote:'Range reflects incomplete evidence, not probability',
  summary:'A dual-camera doorbell for the entrance and parcel-related clip requests in the demo.',
  facts:[['Capture','Illustrated Front Door footage and visitor/parcel clips.'],['Storage','The supplied label lists 8 GB on the doorbell and optional HomeBase 2 / S380. Actual setup is unknown.'],['Cloud & deletion','The reference lists cloud thumbnails; event-clip backup is unverified. It describes clip deletion in the app, with retention depending on storage capacity.']],
  factorNotes:['Manufacturer access is not verified for this doorbell.','Review James’s current Front Door permission, separately from past visits.','The supplied label lists cloud thumbnails. E340 event-clip cloud backup support is unverified.','Visitor detection is illustrated; no real identification or processing location is established.','Exported doorbell clips can remain separate from the original. Real secondary use is unknown.']},
 'omni-s1-pro':{shortName:'Omni S1 Pro',icon:'vacuum',place:'Living Room',purpose:'Robot vacuum & mop',data:'Obstacle sensing & maps',storage:'Cleaning maps · demo setup',person:null,preview:null,scored:false,exposure:[5,5],control:6,scoreNote:'Supplied research label · RGB retention remains unknown',
  summary:'A robot vacuum with obstacle-avoidance sensing. The demo provides no live vacuum camera feed.',
  facts:[['Sensing','The RGB camera is described as obstacle-avoidance sensing, not household video monitoring.'],['Storage & upload','The reference does not establish map storage/upload or RGB image retention. Do not infer these from household video backup settings.'],['Support & deletion','The reference mentions user-submitted logs/images and deleting saved maps. Stored robot RGB access, deletion and retention remain unknown.']],
  factorNotes:['The reference mentions user-submitted logs and images; access to stored RGB data is unknown.','The demo simulates members changing sensing controls; it does not offer a live vacuum feed.','Do not infer vacuum video backup from household cloud-video settings.','Obstacle processing is described by the prototype; its real processing location is unknown.','The reference mentions deletion of saved maps, while RGB deletion and retention remain unknown.']}
};
export const products = Object.entries(definitions).map(([id,definition])=>{
 const source=catalog.find(p=>p.id===id);if(!source)throw new Error(`Missing product in eufy catalog: ${id}`);
 return {id,name:source.name,kind:source.kind,...definition};
});
export const defaultProduct=products[0].id;
export function profileFor(id){return products.find(p=>p.id===id)||products[0];}
export function detectProduct(question,fallback=defaultProduct){
 const q=question.toLowerCase();
 if(/omni|s1\s*pro|robot|vacuum/.test(q))return 'omni-s1-pro';
 if(/e340|doorbell|front door/.test(q))return 'video-doorbell-e340';
 if(/s3\s*pro|eufycam|living room camera/.test(q))return 'eufycam-s3-pro';
 return profileFor(fallback).id;
}
export function productActions(product){
 const p=profileFor(typeof product==='string'?product:product.id);
 const item=(route,label,help='Opens the existing eufy demo in this tab.')=>({route,label,help});
 return [item(`product/${p.id}`,'View product'),item(`services/device/${p.id}`,'Device services'),item('smart',p.person?'Camera controls':'Sensing controls')];
}
