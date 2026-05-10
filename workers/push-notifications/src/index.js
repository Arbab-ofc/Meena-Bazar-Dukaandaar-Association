const textEncoder = new TextEncoder();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Cache-Control': 'no-store'
};

const json = (body, init = {}) =>
  Response.json(body, {
    ...init,
    headers: {
      ...corsHeaders,
      ...(init.headers || {})
    }
  });

const base64Url = (input) => {
  const bytes = typeof input === 'string' ? textEncoder.encode(input) : new Uint8Array(input);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const normalizePrivateKey = (key = '') =>
  key.replace(/\\n/g, '\n').replace(/^"|"$/g, '');

const importPrivateKey = async (privateKey) => {
  const pem = normalizePrivateKey(privateKey)
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s+/g, '');
  const binary = atob(pem);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return crypto.subtle.importKey(
    'pkcs8',
    bytes.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
};

const getAccessToken = async (env) => {
  const clientEmail = env.FIREBASE_CLIENT_EMAIL;
  const privateKey = env.FIREBASE_PRIVATE_KEY;
  if (!clientEmail || !privateKey) {
    throw new Error('Missing FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY.');
  }

  const now = Math.floor(Date.now() / 1000);
  const jwtHeader = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const jwtPayload = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/firebase.messaging https://www.googleapis.com/auth/datastore',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    })
  );
  const unsignedJwt = `${jwtHeader}.${jwtPayload}`;
  const key = await importPrivateKey(privateKey);
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, textEncoder.encode(unsignedJwt));
  const signedJwt = `${unsignedJwt}.${base64Url(signature)}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: signedJwt
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || 'Unable to get Google access token.');
  return data.access_token;
};

const firestoreBase = (projectId) =>
  `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

const hashToken = async (token) => {
  const digest = await crypto.subtle.digest('SHA-256', textEncoder.encode(token));
  return base64Url(digest);
};

const toFirestoreFields = (data) => {
  const fields = {};
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'boolean') fields[key] = { booleanValue: value };
    else if (value instanceof Date) fields[key] = { timestampValue: value.toISOString() };
    else fields[key] = { stringValue: String(value || '') };
  });
  return fields;
};

const savePushToken = async (env, accessToken, payload) => {
  const token = String(payload.token || '').trim();
  if (token.length < 40) throw new Error('Invalid FCM token.');

  const id = await hashToken(token);
  const now = new Date();
  const url = `${firestoreBase(env.FIREBASE_PROJECT_ID)}/push_tokens/${id}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fields: toFirestoreFields({
        token,
        userAgent: payload.userAgent || '',
        permission: payload.permission || 'granted',
        active: true,
        createdAt: now,
        updatedAt: now
      })
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Unable to save push token.');
  }
};

const verifyFirebaseUser = async (env, idToken) => {
  const firebaseApiKey = env.VITE_FIREBASE_API_KEY || env.FIREBASE_WEB_API_KEY;
  if (!firebaseApiKey) throw new Error('Missing VITE_FIREBASE_API_KEY.');

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    }
  );
  const data = await response.json();
  if (!response.ok || !data.users?.[0]?.localId) throw new Error('Invalid Firebase auth token.');
  return data.users[0];
};

const requireAdmin = async (env, accessToken, request) => {
  const authHeader = request.headers.get('Authorization') || '';
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!idToken) throw new Error('Missing admin authorization token.');

  const user = await verifyFirebaseUser(env, idToken);
  const response = await fetch(`${firestoreBase(env.FIREBASE_PROJECT_ID)}/admins/${user.localId}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await response.json().catch(() => ({}));
  const active = data.fields?.isActive?.booleanValue === true;
  if (!response.ok || !active) throw new Error('Authorized admin profile not found.');
  return user;
};

const listPushTokens = async (env, accessToken) => {
  const tokens = [];
  let pageToken = '';

  do {
    const url = new URL(`${firestoreBase(env.FIREBASE_PROJECT_ID)}/push_tokens`);
    url.searchParams.set('pageSize', '500');
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Unable to list push tokens.');

    (data.documents || []).forEach((doc) => {
      const token = doc.fields?.token?.stringValue;
      const active = doc.fields?.active?.booleanValue !== false;
      if (token && active) tokens.push({ token, name: doc.name });
    });
    pageToken = data.nextPageToken || '';
  } while (pageToken);

  return tokens;
};

const deleteTokenDocument = async (accessToken, name) => {
  await fetch(`https://firestore.googleapis.com/v1/${name}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` }
  }).catch(() => {});
};

const toAbsoluteUrl = (env, url = '/') => {
  if (/^https?:\/\//i.test(url)) return url;
  const siteUrl = (env.SITE_URL || '').replace(/\/+$/, '');
  return `${siteUrl}${url.startsWith('/') ? url : `/${url}`}`;
};

const sendToToken = async (env, accessToken, tokenRecord, payload) => {
  const response = await fetch(
    `https://fcm.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/messages:send`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: {
          token: tokenRecord.token,
          notification: {
            title: payload.title,
            body: payload.body
          },
          data: {
            type: payload.type || 'update',
            title: payload.title,
            body: payload.body,
            url: toAbsoluteUrl(env, payload.url)
          },
          webpush: {
            fcm_options: {
              link: toAbsoluteUrl(env, payload.url)
            },
            notification: {
              icon: '/favicon.svg',
              badge: '/favicon.svg'
            }
          }
        }
      })
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error?.message || 'FCM send failed.';
    if (/registration-token-not-registered|UNREGISTERED|INVALID_ARGUMENT/i.test(message)) {
      await deleteTokenDocument(accessToken, tokenRecord.name);
    }
    return { ok: false, message };
  }

  return { ok: true };
};

const handleSubscribe = async (request, env, accessToken) => {
  const payload = await request.json();
  await savePushToken(env, accessToken, payload);
  return json({ ok: true });
};

const handleSend = async (request, env, accessToken) => {
  await requireAdmin(env, accessToken, request);
  const payload = await request.json();
  const title = String(payload.title || '').trim();
  const body = String(payload.body || '').trim();
  if (!title || !body) throw new Error('Notification title and body are required.');

  const tokens = await listPushTokens(env, accessToken);
  const results = await Promise.all(
    tokens.map((tokenRecord) =>
      sendToToken(env, accessToken, tokenRecord, {
        type: payload.type,
        title: title.slice(0, 100),
        body: body.slice(0, 240),
        url: payload.url || '/'
      })
    )
  );

  return json({
    ok: true,
    sent: results.filter((item) => item.ok).length,
    failed: results.filter((item) => !item.ok).length,
    total: tokens.length
  });
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
    if (request.method === 'GET' && url.pathname === '/health') return json({ ok: true });
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, { status: 405 });

    try {
      if (!env.FIREBASE_PROJECT_ID) throw new Error('Missing FIREBASE_PROJECT_ID.');
      const accessToken = await getAccessToken(env);

      if (url.pathname === '/api/push/subscribe') {
        return await handleSubscribe(request, env, accessToken);
      }
      if (url.pathname === '/api/push/send') {
        return await handleSend(request, env, accessToken);
      }

      return json({ error: 'Not found' }, { status: 404 });
    } catch (error) {
      return json({ error: error.message || 'Push worker error.' }, { status: 500 });
    }
  }
};
