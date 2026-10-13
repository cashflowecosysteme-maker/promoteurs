(function(){
  window.nyxMessageSubject=function(m){
    var s=String(m.subject||'');
    return m.from==='eric@nyxia' ? s.replace(/(.+?) s’est éloigné·e \((\d+) j sans connexion\)/,'Suivi de ton équipe : $1 — $2 jours sans connexion').replace(/(.+?) s'est éloigné·e \((\d+) j sans connexion\)/,'Suivi de ton équipe : $1 — $2 jours sans connexion') : s;
  };
  window.nyxMessageBody=function(m){
    var el=document.createElement('div');el.style.whiteSpace='pre-wrap';el.style.overflowWrap='anywhere';
    var body=String(m.body||'');
    if(m.from!=='eric@nyxia'){el.textContent=body;return el;}
    var match=body.match(/mailto:[^\s<>]+/i);
    if(!match){el.textContent=body;return el;}
    var href=match[0];
    if(!/^mailto:[^?\s<>"']+@[^?\s<>"']+(?:\?[^\s<>"']*)?$/i.test(href)){el.textContent=body;return el;}
    var cleaned=body.replace(/✉️ Écrire par courriel :\s*mailto:[^\s<>]+/i,'').trim();
    if(cleaned===body.trim())cleaned=body.replace(href,'').trim();
    el.textContent=cleaned;
    var line=document.createElement('div');line.style.marginTop='14px';
    var a=document.createElement('a');a.href=href;a.textContent='✉️ Écrire un courriel';
    a.style.cssText='display:inline-block;padding:10px 16px;border-radius:12px;background:linear-gradient(135deg,#7B5CFF,#5A6CFF);color:#fff;text-decoration:none;font-family:Outfit,sans-serif;font-size:13px;font-weight:600;white-space:normal';
    a.addEventListener('click',function(e){e.stopPropagation();});
    line.appendChild(a);el.appendChild(line);return el;
  };
})();
