// Original vector illustrations: no real footage, faces or device data.
const shapes={
 camera:'<rect x="18" y="20" width="44" height="34" rx="10"/><circle cx="40" cy="37" r="10"/><circle cx="40" cy="37" r="4"/><path d="M30 55v8m20-8v8M23 65h34m5-34 12-7v26l-12-7"/>',
 support:'<path d="M22 36v-7a18 18 0 0 1 36 0v7M22 30h-6v17h9V30Zm36 0h6v17h-9V30Zm4 17v8H45"/><circle cx="40" cy="30" r="9"/><path d="M28 55q12-13 24 0M36 55h9"/>',
 people:'<circle cx="28" cy="25" r="10"/><path d="M10 59v-8a18 18 0 0 1 36 0v8M47 18a10 10 0 0 1 0 20m7 5a17 17 0 0 1 16 16"/>',
 cloud:'<path d="M23 55h34a14 14 0 0 0 0-28h-1a18 18 0 0 0-34-3 16 16 0 0 0 1 31Z"/><path d="m31 39 9-9 9 9m-9-9v24"/>',
 processing:'<rect x="16" y="12" width="48" height="20" rx="5"/><rect x="16" y="38" width="48" height="20" rx="5"/><circle cx="25" cy="22" r="1"/><circle cx="25" cy="48" r="1"/><path d="M35 22h19m-19 26h19M40 58v9m-15 0h30"/>',
 copies:'<rect x="27" y="26" width="36" height="39" rx="5"/><path d="M21 52h-5V12h36v8m-16 22 7-5 12 8-12 8-7-5z"/>',
 local:'<rect x="17" y="14" width="46" height="48" rx="9"/><path d="M17 47h46M29 25h22m-22 8h22"/><circle cx="40" cy="54" r="2"/>',
 phone:'<rect x="23" y="8" width="34" height="61" rx="7"/><path d="M33 15h14M24 56h32"/><circle cx="40" cy="62" r="1"/>',
 shield:'<path d="m40 9 24 9v18c0 17-24 29-24 29S16 53 16 36V18z"/><path d="m29 36 8 8 16-18"/>',
 history:'<circle cx="40" cy="39" r="26"/><path d="M40 23v18l12 8M15 15l-3 15 15-3"/>',
 evidence:'<rect x="20" y="10" width="40" height="56" rx="6"/><path d="M30 25h20m-20 10h20m-20 10h9m4 10 5 5 10-12"/>',
 original:'<circle cx="40" cy="23" r="10"/><path d="M20 65V48a20 20 0 0 1 40 0v17"/><circle cx="36" cy="22" r="1"/><circle cx="44" cy="22" r="1"/>',
 faces:'<circle cx="40" cy="23" r="10" fill="currentColor" opacity=".2"/><path d="m32 16 16 14m-16-6 12 10M20 65V48a20 20 0 0 1 40 0v17"/>',
 person:'<path d="M30 13h20v20l11 8v24H19V41l11-8Z" fill="currentColor" opacity=".2"/><path d="m22 47 26-26m-26 40 34-34m-22 37 24-24"/>',
 none:'<circle cx="40" cy="39" r="25"/><path d="m22 21 36 36"/>',
 message:'<path d="M12 15h56v39H35L20 66V54h-8Z"/><path d="M25 29h30m-30 12h21"/>',
 bell:'<path d="M20 53h40l-6-10V29a14 14 0 0 0-28 0v14zM34 62q6 8 12 0M40 10v5"/>'
};
export function art(name, css=''){
 const span=document.createElement('span');span.className=`v-art ${css}`;span.setAttribute('aria-hidden','true');
 span.innerHTML=`<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${shapes[name]||shapes.shield}</svg>`;return span;
}
export function scene(name){
 const wrap=document.createElement('div');wrap.className=`v-scene scene-${name}`;wrap.setAttribute('aria-hidden','true');
 const pairs={support:['support','camera'],people:['people','camera'],cloud:['camera','cloud'],processing:['camera','processing'],copies:['copies','phone']};
 const [a,b]=pairs[name]||['shield','camera'];wrap.append(art(a),Object.assign(document.createElement('span'),{className:'scene-connection',textContent:'···'}),art(b));return wrap;
}
