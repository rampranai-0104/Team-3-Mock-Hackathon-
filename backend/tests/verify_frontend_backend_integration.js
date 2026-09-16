const BASE_URL = 'http://localhost:6789/api';

async function testIntegration() {
  console.log('====================================================');
  console.log('Testing Frontend-Backend Live Integration Endpoints');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(desc, condition, details = '') {
    if (condition) {
      console.log(`✓ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${desc} ${details ? '(' + details + ')' : ''}`);
      failed++;
    }
  }

  // 1. Health check
  try {
    const healthRes = await fetch(`${BASE_URL}/health`).then(r => r.json());
    assert('API Health endpoint responds online', healthRes.status === 'online');
  } catch (err) {
    assert('API Health endpoint responds online', false, err.message);
  }

  // 2. Authentication for all 4 seeded roles
  const roles = [
    { name: 'Admin', email: 'admin@tvarita.org', expectedRole: 'admin' },
    { name: 'Artist', email: 'artist@tvarita.org', expectedRole: 'artist' },
    { name: 'Institution', email: 'institution@tvarita.org', expectedRole: 'institution' },
    { name: 'Patron', email: 'patron@tvarita.org', expectedRole: 'public' },
  ];

  const tokens = {};

  for (const r of roles) {
    try {
      const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: r.email, password: 'Tvarita@2026' })
      }).then(res => res.json());

      assert(`${r.name} login succeeds with valid JWT`, loginRes.success && !!loginRes.data?.token);
      if (loginRes.data?.token) {
        tokens[r.expectedRole] = loginRes.data.token;
        assert(`${r.name} user role matches '${r.expectedRole}'`, loginRes.data.user?.role === r.expectedRole);
      }
    } catch (err) {
      assert(`${r.name} login succeeds`, false, err.message);
    }
  }

  // 3. Verify /auth/me for authenticated user
  if (tokens.admin) {
    try {
      const meRes = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${tokens.admin}` }
      }).then(r => r.json());
      assert('/api/auth/me returns current user profile', meRes.success && meRes.data?.user?.email === 'admin@tvarita.org');
    } catch (err) {
      assert('/api/auth/me returns current user profile', false, err.message);
    }
  }

  // 4. Verify Artist Portal /artists/me with Artist token
  if (tokens.artist) {
    try {
      const artistRes = await fetch(`${BASE_URL}/artists/me`, {
        headers: { Authorization: `Bearer ${tokens.artist}` }
      }).then(r => r.json());
      assert('/api/artists/me returns artist profile', artistRes.success && !!artistRes.data?.displayName);
    } catch (err) {
      assert('/api/artists/me returns artist profile', false, err.message);
    }
  }

  // 5. Verify Admin Portal /admin/dashboard with Admin token
  if (tokens.admin) {
    try {
      const dashRes = await fetch(`${BASE_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${tokens.admin}` }
      }).then(r => r.json());
      assert('/api/admin/dashboard returns KPI metrics', dashRes.success && typeof dashRes.data?.users === 'number');
    } catch (err) {
      assert('/api/admin/dashboard returns KPI metrics', false, err.message);
    }
  }

  // 6. Verify Public Endpoints
  try {
    const artFormsRes = await fetch(`${BASE_URL}/public/art-forms`).then(r => r.json());
    assert('Public art forms endpoint returns success', artFormsRes.success && Array.isArray(artFormsRes.data));
  } catch (err) {
    assert('Public art forms endpoint returns success', false, err.message);
  }

  try {
    const productsRes = await fetch(`${BASE_URL}/public/products`).then(r => r.json());
    assert('Public products endpoint returns success', productsRes.success && Array.isArray(productsRes.data));
  } catch (err) {
    assert('Public products endpoint returns success', false, err.message);
  }

  // 7. Verify Registration of new user and profile auto-provisioning
  const testRegEmail = `testuser_${Date.now()}@example.com`;
  try {
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'New Art Lover',
        email: testRegEmail,
        password: 'Password123!',
        role: 'artist',
        phone: '+91 98765 43210'
      })
    }).then(r => r.json());
    assert('User registration succeeds with token', regRes.success && !!regRes.data?.token);

    // Verify auto-provisioned Artist profile exists for this new user
    if (regRes.data?.token) {
      const newArtistRes = await fetch(`${BASE_URL}/artists/me`, {
        headers: { Authorization: `Bearer ${regRes.data.token}` }
      }).then(r => r.json());
      assert('Auto-provisioned Artist profile exists on /artists/me', newArtistRes.success && newArtistRes.data?.displayName === 'New Art Lover');
    }
  } catch (err) {
    assert('User registration and profile auto-provisioning', false, err.message);
  }

  console.log('\n====================================================');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('====================================================');

  process.exit(failed > 0 ? 1 : 0);
}

testIntegration();
