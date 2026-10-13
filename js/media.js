'use strict';
const params=new URLSearchParams(location.search);if(params.get('t'))sessionStorage.setItem('nyxia_token',params.get('t'));
const token=sessionStorage.getItem('nyxia_token')||'';
function expired(){sessionStorage.removeItem('nyxia_token');window.top.location.replace('/login.html');}
let authenticated=false,tab='image',generation=0,controller;
const formats={image:[['','Tous'],['1:1','1:1 · Carré'],['9:16','9:16 · Portrait'],['16:9','16:9 · Paysage'],['4:5','4:5 · Portrait'],['3:2','3:2 · Paysage']],video:[['','Tous'],['9:16','9:16 · Portrait'],['16:9','16:9 · Paysage'],['1:1','1:1 · Carré']]};
const result=document.getElementById('results'),statusEl=document.getElementById('status'),format=document.getElementById('format'),query=document.getElementById('query'),submit=document.querySelector('button[type="submit"]');
function clear(){generation++;if(controller)controller.abort();result.replaceChildren();statusEl.textContent='';submit.disabled=!authenticated;}
function update(){document.getElementById('format-row').hidden=tab==='sound';format.replaceChildren();(formats[tab]||[]).forEach(([value,label])=>format.add(new Option(label,value)));query.placeholder=tab==='sound'?'Ex. pluie, feu de camp, clochette…':'Ex. forêt, coucher de soleil…';}
function safeUrl(value){try{const u=new URL(value,location.href);return u.origin===location.origin&&u.pathname==='/api/media/file'?u.href:'';}catch{return '';}}
async function download(url,button){
  button.disabled=true;button.textContent='Téléchargement…';
  try{
    const r=await fetch(url,{headers:{Range:'bytes=0-0'}});
    if(r.status===401){expired();return;}if(!r.ok)throw Error('Le téléchargement est indisponible. Réessaie.');
    if(r.body)await r.body.cancel();
    const a=document.createElement('a');a.href=url;a.download='';document.body.appendChild(a);a.click();a.remove();
  }catch(e){statusEl.textContent=e.message||'Le téléchargement a échoué. Réessaie.';}
  finally{button.disabled=false;button.textContent='⬇ Télécharger';}
}
function render(items,kind){
  result.replaceChildren();
  items.forEach((m,i)=>{
    const src=safeUrl(kind==='image'?m.previewUrl:kind==='video'?m.videoUrl:m.audioUrl),url=safeUrl(m.downloadUrl);if(!src||!url)return;
    const card=document.createElement('article');card.className='media-card';
    const media=document.createElement(kind==='image'?'img':kind==='video'?'video':'audio');media.src=src;
    if(kind==='image'){media.alt='Résultat '+(i+1);media.loading='lazy';}else{media.controls=true;media.preload='metadata';if(kind==='video'){media.playsInline=true;const poster=safeUrl(m.previewUrl);if(poster)media.poster=poster;}}
    media.addEventListener('error',()=>{statusEl.textContent='Un aperçu est indisponible. Tu peux essayer un autre résultat.';});
    card.append(media);const info=document.createElement('div');info.className='media-info';const label=document.createElement('p');label.textContent=kind==='sound'?'Son '+(i+1)+' · '+m.duration+' s':m.width+' × '+m.height;info.append(label);
    const btn=document.createElement('button');btn.textContent='⬇ Télécharger';btn.addEventListener('click',()=>download(url,btn));info.append(btn);card.append(info);result.append(card);
  });
}
async function search(){
  const q=query.value.trim();if(!q||!authenticated)return;clear();const current=generation,kind=tab;controller=new AbortController();submit.disabled=true;statusEl.textContent='Recherche en cours…';
  try{
    const r=await fetch('/api/media/'+({image:'images',video:'videos',sound:'sounds'})[kind],{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,query:q,format:kind==='sound'?'':format.value}),signal:controller.signal});
    if(r.status===401){expired();return;}const data=await r.json();if(!r.ok||data.error)throw Error(data.error||'La recherche est indisponible. Réessaie.');if(current!==generation)return;
    const items=(data.results||[]).filter(m=>m.type===kind);render(items,kind);
    statusEl.textContent=(result.children.length?result.children.length+' résultat(s)':"Aucun résultat pour cette recherche et ce format. Essaie un autre mot ou un autre format.")+(data.warning?' '+data.warning:'');
  }catch(e){if(e.name!=='AbortError'&&current===generation)statusEl.textContent=e.message||'La recherche est indisponible. Réessaie.';}
  finally{if(current===generation)submit.disabled=!authenticated;}
}
document.querySelectorAll('[data-tab]').forEach(button=>button.addEventListener('click',()=>{clear();tab=button.dataset.tab;document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',String(b===button)));update();if(query.value.trim())search();}));
format.addEventListener('change',()=>{clear();if(query.value.trim())search();});document.getElementById('media-search').addEventListener('submit',e=>{e.preventDefault();search();});update();submit.disabled=true;
(async()=>{
  if(!token){expired();return;}
  try{const r=await fetch('/api/check-auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token})});if(!r.ok)throw Error();const d=await r.json();if(!d.valid){expired();return;}authenticated=true;submit.disabled=false;}
  catch{statusEl.textContent='Connexion indisponible. Recharge la page.';}
})();
