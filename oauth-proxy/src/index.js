const encoder = new TextEncoder();

function base64url(bytes) {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function randomToken(bytes = 18) {
  const value = new Uint8Array(bytes);
  crypto.getRandomValues(value);
  return base64url(value);
}

async function hmac(value, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return base64url(new Uint8Array(sig));
}

async function createState(secret) {
  const payload = `${randomToken()}.${Math.floor(Date.now() / 1000)}`;
  return `${payload}.${await hmac(payload, secret)}`;
}

async function verifyState(state, secret) {
  if (!state || !secret) return false;
  const parts = state.split('.');
  if (parts.length !== 3) return false;
  const [nonce, timestamp, signature] = parts;
  const ts = Number(timestamp);
  if (!nonce || !Number.isFinite(ts)) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > 600) return false;
  const expected = await hmac(`${nonce}.${timestamp}`, secret);
  return signature === expected;
}

function required(env) {
  const missing = ['GITHUB_OAUTH_ID', 'GITHUB_OAUTH_SECRET', 'STATE_SECRET', 'CMS_ORIGIN']
    .filter((key) => !env[key]);
  return missing;
}

function callbackPage(env, status, payload) {
  const targetOrigin = env.CMS_ORIGIN;
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  return new Response(`<!doctype html>
<html><head><meta charset="utf-8"><title>FPFT Lab Login</title></head>
<body><p>GitHub 인증을 마무리하고 있습니다.</p>
<script>
(() => {
  const targetOrigin = ${JSON.stringify(targetOrigin)};
  const result = ${JSON.stringify(message)};
  const send = () => {
    if (window.opener) window.opener.postMessage(result, targetOrigin);
  };
  window.addEventListener('message', send, { once: true });
  if (window.opener) window.opener.postMessage('authorizing:github', targetOrigin);
  setTimeout(send, 1200);
})();
</script></body></html>`, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer'
    }
  });
}

async function exchangeCode(url, env, code) {
  const redirectUri = `${url.origin}/callback?provider=github`;
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'CNU-FPFT-Lab-Decap-OAuth'
    },
    body: JSON.stringify({
      client_id: env.GITHUB_OAUTH_ID,
      client_secret: env.GITHUB_OAUTH_SECRET,
      code,
      redirect_uri: redirectUri
    })
  });
  if (!response.ok) throw new Error(`GitHub token exchange failed (${response.status})`);
  const data = await response.json();
  if (!data.access_token) throw new Error(data.error_description || data.error || 'GitHub access token missing');
  return data.access_token;
}

async function checkAllowlist(token, env) {
  const raw = (env.ALLOWED_GITHUB_USERS || '').trim();
  if (!raw) return true;
  const allowed = new Set(raw.split(',').map((x) => x.trim().toLowerCase()).filter(Boolean));
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'CNU-FPFT-Lab-Decap-OAuth',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  if (!response.ok) return false;
  const user = await response.json();
  return allowed.has(String(user.login || '').toLowerCase());
}

async function handleAuth(url, env) {
  const provider = url.searchParams.get('provider');
  if (provider !== 'github') return new Response('Invalid provider', { status: 400 });

  const siteId = url.searchParams.get('site_id');
  if (env.ALLOWED_SITE_ID && siteId && siteId !== env.ALLOWED_SITE_ID) {
    return new Response('Invalid site', { status: 403 });
  }

  const missing = required(env);
  if (missing.length) return new Response(`Worker secrets are not configured: ${missing.join(', ')}`, { status: 503 });

  const redirectUri = `${url.origin}/callback?provider=github`;
  const scope = env.GITHUB_REPO_PRIVATE === '1' ? 'repo read:user' : 'public_repo read:user';
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', env.GITHUB_OAUTH_ID);
  authorize.searchParams.set('redirect_uri', redirectUri);
  authorize.searchParams.set('scope', scope);
  authorize.searchParams.set('state', await createState(env.STATE_SECRET));
  return Response.redirect(authorize.toString(), 302);
}

async function handleCallback(url, env) {
  if (url.searchParams.get('provider') !== 'github') return new Response('Invalid provider', { status: 400 });
  if (url.searchParams.get('error')) {
    return callbackPage(env, 'error', { error: url.searchParams.get('error_description') || url.searchParams.get('error') });
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code || !(await verifyState(state, env.STATE_SECRET))) {
    return callbackPage(env, 'error', { error: 'OAuth state validation failed' });
  }

  try {
    const token = await exchangeCode(url, env, code);
    if (!(await checkAllowlist(token, env))) {
      return callbackPage(env, 'error', { error: 'This GitHub account is not allowed to use the FPFT Lab editor.' });
    }
    return callbackPage(env, 'success', { token });
  } catch (error) {
    return callbackPage(env, 'error', { error: error instanceof Error ? error.message : 'OAuth failed' });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/auth') return handleAuth(url, env);
    if (url.pathname === '/callback') return handleCallback(url, env);
    return new Response('FPFT Lab Decap OAuth proxy is running.', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
    });
  }
};
