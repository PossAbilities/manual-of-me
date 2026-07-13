const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }
    const url = new URL(request.url);
    const id  = url.searchParams.get('id');
    if (!id || id.length < 8) {
      return json({ error: 'Missing or invalid id' }, 400);
    }
    if (request.method === 'GET') {
      const data = await env.MANUAL_OF_ME.get(id);
      return json(data ? JSON.parse(data) : {});
    }
    if (request.method === 'POST') {
      let body;
      try {
        body = await request.text();
        JSON.parse(body);
      } catch {
        return json({ error: 'Invalid JSON' }, 400);
      }
      await env.MANUAL_OF_ME.put(id, body);
      return json({ ok: true });
    }
    return json({ error: 'Method not allowed' }, 405);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}
