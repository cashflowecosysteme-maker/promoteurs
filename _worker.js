/**
 * nyxia.top — Worker domaine entier
 * - Lien court promoteur : /r/CODE → /?ref=CODE
 * - Injecte ref-track.js sur CHAQUE page HTML
 * - API compteur ref
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Lien court : https://nyxia.top/r/EPUV39MT
    const short = url.pathname.match(/^\/r\/([A-Za-z0-9_-]{3,32})\/?$/);
    if (short && request.method === 'GET') {
      const code = short[1].toUpperCase();
      // Compteur clic
      try {
        if (env.CASHFLOW_KV) {
          const day = new Date().toISOString().slice(0, 10);
          const key = 'ref_click:' + code + ':' + day;
          const prev = parseInt((await env.CASHFLOW_KV.get(key)) || '0', 10) || 0;
          await env.CASHFLOW_KV.put(key, String(prev + 1), { expirationTtl: 120 * 24 * 3600 });
        }
      } catch (_) {}
      // Destination : page phare avec ref (le script ref-track enregistre le code)
      const dest = new URL('/', url.origin);
      dest.searchParams.set('ref', code);
      return Response.redirect(dest.toString(), 302);
    }

    if (url.pathname === '/api/ref-ping' && request.method === 'POST') {
      try {
        const body = await request.json();
        const ref = String(body.ref || '').trim().toUpperCase().slice(0, 32);
        if (!ref) return json({ ok: false }, 400);
        if (env.CASHFLOW_KV) {
          const day = new Date().toISOString().slice(0, 10);
          const key = 'ref_click:' + ref + ':' + day;
          const prev = parseInt((await env.CASHFLOW_KV.get(key)) || '0', 10) || 0;
          await env.CASHFLOW_KV.put(key, String(prev + 1), { expirationTtl: 120 * 24 * 3600 });
        }
        return json({ ok: true });
      } catch (e) {
        return json({ ok: false }, 400);
      }
    }

    if (url.pathname === '/api/ref-stats' && request.method === 'GET') {
      const ref = (url.searchParams.get('ref') || '').trim().toUpperCase();
      if (!ref || !env.CASHFLOW_KV) return json({ clicks: 0 });
      const day = new Date().toISOString().slice(0, 10);
      const n = parseInt((await env.CASHFLOW_KV.get('ref_click:' + ref + ':' + day)) || '0', 10) || 0;
      return json({ ref, day, clicks: n });
    }

    let res = await env.ASSETS.fetch(request);

    const ct = (res.headers.get('Content-Type') || '').toLowerCase();
    const isHtml = ct.includes('text/html') || url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname === '';

    if (!isHtml || request.method !== 'GET') {
      return res;
    }

    let html = await res.text();
    if (!html.includes('ref-track.js')) {
      const tag = '<script src="/ref-track.js" defer></script>';
      if (html.includes('</body>')) {
        html = html.replace('</body>', tag + '\n</body>');
      } else {
        html += tag;
      }
    }

    const headers = new Headers(res.headers);
    headers.set('Content-Type', 'text/html; charset=utf-8');
    return new Response(html, { status: res.status, headers });
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
