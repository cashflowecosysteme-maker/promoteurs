(function(){
 var style=document.createElement('style');
 style.textContent=`
 .nyxia-paypal-trigger{background:#f2c66d;color:#160f25;border:1px solid #ffe5a4;white-space:nowrap}
 .nyxia-paypal-trigger:hover{background:#ffe5a4;box-shadow:0 0 18px rgba(242,198,109,.2)}
 .nyxia-paypal-popup{position:fixed;inset:0;margin:auto;width:min(480px,calc(100vw - 32px));max-height:calc(100dvh - 32px);overflow:auto;box-sizing:border-box;padding:32px;background:linear-gradient(145deg,#101b35,#0A1628);color:#D6D9F0;border:1px solid rgba(242,198,109,.5);border-radius:24px;box-shadow:0 24px 80px rgba(0,0,0,.65),0 0 36px rgba(123,92,255,.15);font-family:'Outfit',sans-serif;text-align:left}
 .nyxia-paypal-popup::backdrop{background:rgba(3,7,18,.8);backdrop-filter:blur(7px)}
 .nyxia-paypal-popup .paypal-close{position:absolute;top:14px;right:14px;display:grid;place-items:center;width:34px;height:34px;border-radius:50%;border:1px solid rgba(167,139,250,.3);background:rgba(123,92,255,.12);color:#D6D9F0;font:22px 'Outfit',sans-serif;cursor:pointer}
 .nyxia-paypal-popup .paypal-close:hover{background:rgba(123,92,255,.25)}
 .nyxia-paypal-popup .paypal-symbol{display:grid;place-items:center;width:52px;height:52px;border-radius:16px;background:rgba(242,198,109,.08);border:1px solid rgba(242,198,109,.25);color:#f2c66d;font-size:25px;margin-bottom:18px}
 .nyxia-paypal-popup h3{margin:0 26px 10px 0;color:#f2c66d;font:600 28px 'Cormorant Garamond',serif;line-height:1.2}
 .nyxia-paypal-popup .paypal-description{margin:0 0 24px;font-size:14px;line-height:1.65;color:#aeb6d4}
 .nyxia-paypal-popup label{display:block;margin-bottom:9px;color:#D6D9F0;font-size:13px;font-weight:500}
 .nyxia-paypal-popup input{box-sizing:border-box;display:block;width:100%;min-width:0;border-radius:13px;border:1px solid rgba(167,139,250,.3);background:rgba(6,10,24,.65);color:#fff;padding:14px 16px;font:14px 'Outfit',sans-serif;outline:none;transition:border-color .2s,box-shadow .2s}
 .nyxia-paypal-popup input::placeholder{color:#727eaa}
 .nyxia-paypal-popup input:focus{border-color:#a78bfa;box-shadow:0 0 0 3px rgba(123,92,255,.12)}
 .nyxia-paypal-popup .paypal-save{display:block;width:100%;margin-top:20px;min-height:44px;border-radius:50px;border:1px solid #ffe5a4;background:#f2c66d;color:#160f25;font:600 14px 'Outfit',sans-serif;cursor:pointer}
 .nyxia-paypal-popup .paypal-save:hover{background:#ffe5a4;box-shadow:0 0 18px rgba(242,198,109,.2)}
 .nyxia-paypal-popup .paypal-save:disabled{opacity:.6;cursor:wait}
 .nyxia-paypal-popup #paypal-status{margin:14px 0 0;min-height:20px;color:#a78bfa;font-size:13px;line-height:1.5}
 @media(max-width:520px){.nyxia-paypal-popup{padding:26px 22px}.nyxia-paypal-popup h3{font-size:25px}}
 `;
 document.head.appendChild(style);
 var button=document.createElement('button');button.type='button';button.className='btn-header nyxia-paypal-trigger';button.textContent='Mon PayPal';button.setAttribute('aria-haspopup','dialog');
 document.querySelector('.header-actions').prepend(button);
 var dialog=document.createElement('dialog');dialog.className='nyxia-paypal-popup';dialog.setAttribute('aria-labelledby','paypal-title');
 dialog.innerHTML='<form method="dialog"><button class="paypal-close" aria-label="Fermer" title="Fermer">×</button></form><div class="paypal-symbol" aria-hidden="true">✦</div><h3 id="paypal-title">Mon compte PayPal</h3><p class="paypal-description">Ajoute ton adresse courriel PayPal pour recevoir tes commissions. Tu peux la modifier ici à tout moment.</p><form id="paypal-form"><label for="paypal-email">Ton adresse courriel PayPal</label><input id="paypal-email" type="email" autocomplete="email" placeholder="tonadresse@exemple.com"><button class="paypal-save" type="submit">Enregistrer mon PayPal</button></form><p id="paypal-status" role="status" aria-live="polite"></p>';
 document.body.appendChild(dialog);
 async function call(method,body){var r=await fetch('/api/profile/paypal',{method:method,headers:{'Content-Type':'application/json','X-Cercle-Token':sessionStorage.getItem('nyxia_token')||''},body:body?JSON.stringify(body):undefined});var d=await r.json();if(!r.ok||d.error)throw new Error(d.error||'Impossible de charger ton compte.');return d}
 button.onclick=async function(){dialog.showModal();var status=document.getElementById('paypal-status'),input=document.getElementById('paypal-email'),save=dialog.querySelector('.paypal-save');status.textContent='Chargement…';input.disabled=true;save.disabled=true;try{var d=await call('GET');input.value=d.paypal||'';status.textContent='';input.disabled=false;save.disabled=false;input.focus()}catch(e){status.textContent=e.message}};
 document.getElementById('paypal-form').onsubmit=async function(e){e.preventDefault();var save=dialog.querySelector('.paypal-save');save.disabled=true;try{await call('POST',{paypal:document.getElementById('paypal-email').value});document.getElementById('paypal-status').textContent='Adresse PayPal enregistrée.'}catch(e){document.getElementById('paypal-status').textContent=e.message}finally{save.disabled=false}};
})();
