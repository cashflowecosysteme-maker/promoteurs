(function(){
  var code=(new URLSearchParams(location.search).get('ref')||'').trim().toUpperCase();
  if(!/^[A-Z0-9_-]{1,80}$/.test(code))return;
  document.querySelectorAll('.join').forEach(function(a){var u=new URL(a.href);u.searchParams.set('ref',code);a.href=u.toString();});
})();
