const http = require('http');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 3000);
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY || process.env.VITE_IMAGEKIT_PUBLIC_KEY;

const json = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(body));
};

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    return json(res, 200, { ok: true });
  }

  if (req.method === 'GET' && req.url === '/api/imagekit-auth') {
    if (!IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_PUBLIC_KEY) {
      return json(res, 500, {
        error: 'Missing IMAGEKIT_PRIVATE_KEY or IMAGEKIT_PUBLIC_KEY in auth service environment.'
      });
    }

    const token = crypto.randomBytes(16).toString('hex');
    const expire = Math.floor(Date.now() / 1000) + 30 * 60;
    const signature = crypto
      .createHmac('sha1', IMAGEKIT_PRIVATE_KEY)
      .update(token + expire)
      .digest('hex');

    return json(res, 200, {
      token,
      expire,
      signature,
      publicKey: IMAGEKIT_PUBLIC_KEY
    });
  }

  return json(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`[imagekit-auth] listening on ${PORT}`);
});
