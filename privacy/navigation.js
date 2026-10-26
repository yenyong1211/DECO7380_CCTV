import {profileFor, defaultProduct} from './profiles.js?v=airis1';
export const views=['profile','exposure','controls','flow','evidence','review'];
export function readRoute(url,preferred=defaultProduct){
 const p=new URL(url).searchParams;const product=profileFor(p.get('product')||preferred).id;const view=views.includes(p.get('view'))?p.get('view'):'profile';
 const q=(p.get('q')||'').trim().slice(0,300);let page=p.get('page');
 if(!['home','search','product','guide','settings'].includes(page))page=q?'search':p.has('product')||p.has('view')?'product':'home';
 if(page==='search'&&!q)page='home';
 return {page,product,view,q,section:['privacy','data','profile'].includes(p.get('section'))?p.get('section'):'privacy'};
}
export function routeURL(base,state){const url=new URL(base);url.search='';url.hash='';if(state.page==='home')return url.href;url.searchParams.set('page',state.page);if(['product','guide','search'].includes(state.page))url.searchParams.set('product',profileFor(state.product).id);if(state.page==='product')url.searchParams.set('view',views.includes(state.view)?state.view:'profile');if(state.page==='search')url.searchParams.set('q',String(state.q||'').slice(0,300));if(state.page==='settings')url.searchParams.set('section',['privacy','data','profile'].includes(state.section)?state.section:'privacy');return url.href;}
