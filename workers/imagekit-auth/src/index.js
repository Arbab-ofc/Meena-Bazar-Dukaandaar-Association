const textEncoder = new TextEncoder();

function hexFromBuffer(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function hmacSha1(message, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', key, textEncoder.encode(message));
  return hexFromBuffer(signatureBuffer);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    if (request.method !== 'GET') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    if (url.pathname !== '/api/imagekit-auth' && url.pathname !== '/') {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }

    const privateKey = env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = env.IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      return Response.json(
        { error: 'Missing IMAGEKIT_PRIVATE_KEY or IMAGEKIT_PUBLIC_KEY' },
        { status: 500 }
      );
    }

    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 30 * 60;
    const signature = await hmacSha1(token + expire, privateKey);

    return Response.json(
      { token, expire, signature, publicKey },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
};
