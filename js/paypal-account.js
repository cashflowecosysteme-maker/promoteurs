(function(){
 var button=document.createElement('button');button.type='button';button.className='btn-header';button.textContent='Mon PayPal';button.style.cssText='background:#7B5CFF;color:white';
 document.querySelector('.header-actions').prepend(button);
 var dialog=document.createElement('dialog');dialog.style.cssText='background:#0A1628;color:white;border:1px solid #7B5CFF;border-radius:16px;padding:24px;max-width:500px;width:90%';
 dialog.innerHTML='<form method="dialog"><button style="float:right">Fermer</button></form><h3>Mon compte PayPal</h3><p>Adresse utilisée pour recevoir tes commissions.</p><form id="paypal-form"><label for="paypal-email">Adresse PayPal</label><input id="paypal-email" type="email" style="display:block;margin:16px 0;padding:12px;width:100%"><button type="submit">Enregistrer</button></form><p id="paypal-status" role="status"></p>';
 document.body.appendChild(dialog);
 async function call(method,body){var r=await fetch('/api/profile/paypal',{method:method,headers:{'Content-Type':'application/json','X-Cercle-Token':sessionStorage.getItem('nyxia_token')||''},body:body?JSON.stringify(body):undefined});var d=await r.json();if(!r.ok||d.error)throw new Error(d.error||'Impossible de charger ton compte.');return d}
 button.onclick=async function(){try{var d=await call('GET');document.getElementById('paypal-email').value=d.paypal||'';document.getElementById('paypal-status').textContent='';dialog.showModal()}catch(e){alert(e.message)}};
 document.getElementById('paypal-form').onsubmit=async function(e){e.preventDefault();try{await call('POST',{paypal:document.getElementById('paypal-email').value});document.getElementById('paypal-status').textContent='Adresse PayPal enregistrée.'}catch(e){document.getElementById('paypal-status').textContent=e.message}};
})();
