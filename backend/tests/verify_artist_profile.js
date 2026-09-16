const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const User = require('../src/models/User');
const Artist = require('../src/models/Artist');
const ArtForm = require('../src/models/ArtForm');
const { ROLES, ARTIST_VERIFICATION_STATUS } = require('../src/constants');

const TEST_PORT = 5055;
const BASE_URL = `http://localhost:${TEST_PORT}`;
const JWT_SECRET = process.env.JWT_SECRET || 'tvarita_super_secret_jwt_key_2026_dev';

let server;
let testUsers = {};
let tokens = {};
let seededArtist;
let createdMediaId;

// Helper to generate auth token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Test runner assertion helper
let passedCount = 0;
let failedCount = 0;

const assertTest = (description, condition, details = '') => {
  if (condition) {
    console.log(`  ✓ PASS: ${description}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${description} ${details ? '(' + details + ')' : ''}`);
    failedCount++;
  }
};

async function setup() {
  console.log('\n--- Setting up Test Environment ---');
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tvarita';
  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB for testing.');

  // Clean up any old test users
  await User.deleteMany({ email: /@test-tvarita\.local$/ });
  await Artist.deleteMany({ displayName: /Test Artist/ });
  await ArtForm.deleteMany({ slug: /test-art-form/ });

  // Create a test art form
  const artForm = await ArtForm.create({
    name: 'Warli Painting',
    slug: 'warli-painting-test-art-form',
    description: 'Traditional folk art form of Maharashtra',
    regions: ['Maharashtra']
  });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  // 1. Artist user with profile
  testUsers.artist = await User.create({
    name: 'Jivya Soma Mashe',
    email: 'jivya@test-tvarita.local',
    passwordHash,
    role: ROLES.ARTIST
  });
  tokens.artist = generateToken(testUsers.artist);

  // 2. Another artist user WITHOUT profile
  testUsers.artistNoProfile = await User.create({
    name: 'New Artist',
    email: 'newartist@test-tvarita.local',
    passwordHash,
    role: ROLES.ARTIST
  });
  tokens.artistNoProfile = generateToken(testUsers.artistNoProfile);

  // 3. Another artist user WITH profile (for isolation testing)
  testUsers.anotherArtist = await User.create({
    name: 'Bhawani Singh',
    email: 'bhawani@test-tvarita.local',
    passwordHash,
    role: ROLES.ARTIST
  });
  tokens.anotherArtist = generateToken(testUsers.anotherArtist);

  await Artist.create({
    userId: testUsers.anotherArtist._id,
    displayName: 'Test Artist Bhawani',
    bio: 'Bhawani bio',
    location: { city: 'Udaipur', state: 'Rajasthan', country: 'India' }
  });

  // 4. Public user
  testUsers.public = await User.create({
    name: 'Arjun Public',
    email: 'arjun@test-tvarita.local',
    passwordHash,
    role: ROLES.PUBLIC
  });
  tokens.public = generateToken(testUsers.public);

  // 5. Institution user
  testUsers.institution = await User.create({
    name: 'DPS School',
    email: 'school@test-tvarita.local',
    passwordHash,
    role: ROLES.INSTITUTION
  });
  tokens.institution = generateToken(testUsers.institution);

  // Seed profile for main test artist
  seededArtist = await Artist.create({
    userId: testUsers.artist._id,
    displayName: 'Test Artist Jivya',
    bio: 'Renowned Warli master artist.',
    artFormIds: [artForm._id],
    location: { city: 'Dahanu', state: 'Maharashtra', country: 'India' },
    languages: ['Marathi', 'Hindi'],
    experience: 25,
    verificationStatus: ARTIST_VERIFICATION_STATUS.PENDING,
    availability: { isAvailable: true, notes: 'Available on weekdays' }
  });

  // Start Express server on test port
  await new Promise((resolve) => {
    server = app.listen(TEST_PORT, () => {
      console.log(`Test server running on port ${TEST_PORT}\n`);
      resolve();
    });
  });
}

async function runTests() {
  console.log('==================================================');
  console.log('RUNNING ARTIST PROFILE TEST SUITE');
  console.log('==================================================\n');

  // -------------------------------------------------------------
  // 1. Health Check
  // -------------------------------------------------------------
  console.log('Test 1: Server Health Check');
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const healthData = await healthRes.json();
  assertTest('GET /api/health returns 200', healthRes.status === 200);
  assertTest('Health check response has success: true', healthData.success === true);

  // -------------------------------------------------------------
  // 2. Authentication & Role Authorization Tests
  // -------------------------------------------------------------
  console.log('\nTest 2: Authentication & Authorization Checks');
  
  // 2.1 No token
  const noTokenRes = await fetch(`${BASE_URL}/api/artists/me`);
  const noTokenData = await noTokenRes.json();
  assertTest('Unauthenticated GET /api/artists/me is rejected (401)', noTokenRes.status === 401);
  assertTest('Rejection message indicates auth required', noTokenData.success === false);

  // 2.2 Invalid token
  const invalidTokenRes = await fetch(`${BASE_URL}/api/artists/me`, {
    headers: { Authorization: 'Bearer invalid.token.value' }
  });
  assertTest('Invalid token is rejected (401)', invalidTokenRes.status === 401);

  // 2.3 Public user token
  const publicUserRes = await fetch(`${BASE_URL}/api/artists/me`, {
    headers: { Authorization: `Bearer ${tokens.public}` }
  });
  assertTest('Public user is rejected with 403 Forbidden', publicUserRes.status === 403);

  // 2.4 Institution user token
  const institutionUserRes = await fetch(`${BASE_URL}/api/artists/me`, {
    headers: { Authorization: `Bearer ${tokens.institution}` }
  });
  assertTest('Institution user is rejected with 403 Forbidden', institutionUserRes.status === 403);

  // -------------------------------------------------------------
  // 3. GET /api/artists/me
  // -------------------------------------------------------------
  console.log('\nTest 3: GET /api/artists/me (Get Own Profile)');

  // 3.1 Artist with profile
  const artistProfileRes = await fetch(`${BASE_URL}/api/artists/me`, {
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  const artistProfileData = await artistProfileRes.json();
  assertTest('Artist gets own profile with 200 OK', artistProfileRes.status === 200);
  assertTest('Response contains success: true', artistProfileData.success === true);
  assertTest('Profile displayName matches', artistProfileData.data?.displayName === 'Test Artist Jivya');
  assertTest('Profile contains location data', artistProfileData.data?.location?.city === 'Dahanu');
  assertTest('Profile contains languages array', Array.isArray(artistProfileData.data?.languages) && artistProfileData.data.languages.includes('Marathi'));
  assertTest('Profile contains verificationStatus', artistProfileData.data?.verificationStatus === 'pending');
  assertTest('Profile populates artFormIds', artistProfileData.data?.artFormIds?.[0]?.name === 'Warli Painting');

  // 3.2 Artist without profile record -> 404
  const noProfileRes = await fetch(`${BASE_URL}/api/artists/me`, {
    headers: { Authorization: `Bearer ${tokens.artistNoProfile}` }
  });
  assertTest('Artist without profile receives 404 Not Found', noProfileRes.status === 404);

  // 3.3 Isolation: Authenticated artist receives ONLY their own profile
  const anotherArtistRes = await fetch(`${BASE_URL}/api/artists/me`, {
    headers: { Authorization: `Bearer ${tokens.anotherArtist}` }
  });
  const anotherArtistData = await anotherArtistRes.json();
  assertTest('Another artist receives ONLY their own profile (isolation)', 
    anotherArtistData.data?.displayName === 'Test Artist Bhawani' &&
    anotherArtistData.data?.displayName !== 'Test Artist Jivya'
  );

  // -------------------------------------------------------------
  // 4. PATCH /api/artists/me (Update Own Profile)
  // -------------------------------------------------------------
  console.log('\nTest 4: PATCH /api/artists/me (Update Own Profile)');

  // 4.1 Valid update
  const validUpdateRes = await fetch(`${BASE_URL}/api/artists/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.artist}`
    },
    body: JSON.stringify({
      displayName: 'Test Artist Jivya Updated',
      bio: 'Master artist with national recognition.',
      location: { city: 'Palghar', state: 'Maharashtra', country: 'India' },
      languages: ['Marathi', 'Hindi', 'English'],
      experience: 30,
      availability: { isAvailable: false, notes: 'Currently conducting workshop' }
    })
  });
  const validUpdateData = await validUpdateRes.json();
  assertTest('Valid update returns 200 OK', validUpdateRes.status === 200);
  assertTest('DisplayName updated in response', validUpdateData.data?.displayName === 'Test Artist Jivya Updated');
  assertTest('Experience updated to 30', validUpdateData.data?.experience === 30);
  assertTest('Languages updated to include English', validUpdateData.data?.languages?.includes('English'));
  assertTest('Availability updated to false', validUpdateData.data?.availability?.isAvailable === false);

  // 4.2 Protected fields tamper attempt: verificationStatus
  const tamperStatusRes = await fetch(`${BASE_URL}/api/artists/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.artist}`
    },
    body: JSON.stringify({
      verificationStatus: 'approved'
    })
  });
  const tamperStatusData = await tamperStatusRes.json();
  assertTest('Tampering with verificationStatus is rejected (400)', tamperStatusRes.status === 400);
  assertTest('Error message flags protected field modification', 
    tamperStatusData.errors?.some(e => e.field === 'verificationStatus')
  );

  // Verify in DB that verificationStatus remained 'pending'
  const verifyDbArtist = await Artist.findById(seededArtist._id);
  assertTest('Database verificationStatus remained unchanged ("pending")', 
    verifyDbArtist.verificationStatus === 'pending'
  );

  // 4.3 Protected fields tamper attempt: userId
  const tamperUserIdRes = await fetch(`${BASE_URL}/api/artists/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.artist}`
    },
    body: JSON.stringify({
      userId: new mongoose.Types.ObjectId().toString()
    })
  });
  assertTest('Tampering with userId is rejected (400)', tamperUserIdRes.status === 400);

  // 4.4 Invalid input: Empty display name
  const invalidNameRes = await fetch(`${BASE_URL}/api/artists/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.artist}`
    },
    body: JSON.stringify({
      displayName: '   '
    })
  });
  assertTest('Empty display name is rejected (400)', invalidNameRes.status === 400);

  // 4.5 Invalid input: Negative experience
  const invalidExpRes = await fetch(`${BASE_URL}/api/artists/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.artist}`
    },
    body: JSON.stringify({
      experience: -5
    })
  });
  assertTest('Negative experience is rejected (400)', invalidExpRes.status === 400);

  // -------------------------------------------------------------
  // 5. POST /api/artists/me/media (Upload Media)
  // -------------------------------------------------------------
  console.log('\nTest 5: POST /api/artists/me/media (Upload Media)');

  // 5.1 Missing file
  const missingFileRes = await fetch(`${BASE_URL}/api/artists/me/media`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokens.artist}`
    }
  });
  assertTest('Missing file is rejected with 400', missingFileRes.status === 400);

  // 5.2 Invalid file type (e.g. text/plain)
  const invalidFileForm = new FormData();
  const textBlob = new Blob(['sample text file content'], { type: 'text/plain' });
  invalidFileForm.append('media', textBlob, 'test.txt');

  const invalidFileRes = await fetch(`${BASE_URL}/api/artists/me/media`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokens.artist}`
    },
    body: invalidFileForm
  });
  assertTest('Invalid file type (text/plain) is rejected with 400', invalidFileRes.status === 400);

  // 5.3 Valid image file upload (PNG)
  const validImageForm = new FormData();
  // 1x1 transparent PNG bytes
  const pngBytes = new Uint8Array([
    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1,
    0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 10, 73, 68, 65, 84,
    120, 156, 99, 0, 1, 0, 0, 5, 0, 1, 13, 10, 45, 180, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130
  ]);
  const pngBlob = new Blob([pngBytes], { type: 'image/png' });
  validImageForm.append('media', pngBlob, 'warli_artwork.png');
  validImageForm.append('title', 'Warli Village Harmony');
  validImageForm.append('description', 'Rice paste on mud wall traditional motif');
  validImageForm.append('type', 'image');

  const uploadRes = await fetch(`${BASE_URL}/api/artists/me/media`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokens.artist}`
    },
    body: validImageForm
  });
  const uploadData = await uploadRes.json();
  assertTest('Valid image upload returns 201 Created', uploadRes.status === 201);
  assertTest('Upload response has media item with url', Boolean(uploadData.data?.url));
  assertTest('Upload response has publicId', Boolean(uploadData.data?.publicId));
  assertTest('Upload response preserves title', uploadData.data?.title === 'Warli Village Harmony');
  assertTest('Upload response preserves description', uploadData.data?.description === 'Rice paste on mud wall traditional motif');
  assertTest('Upload response has generated _id', Boolean(uploadData.data?._id));

  createdMediaId = uploadData.data?._id;

  // Verify media saved in DB
  const artistWithMedia = await Artist.findById(seededArtist._id);
  assertTest('Media is stored in MongoDB artist document', 
    artistWithMedia.media.some(m => m._id.toString() === createdMediaId)
  );

  // -------------------------------------------------------------
  // 6. DELETE /api/artists/me/media/:mediaId (Delete Own Media)
  // -------------------------------------------------------------
  console.log('\nTest 6: DELETE /api/artists/me/media/:mediaId (Delete Own Media)');

  // 6.1 Invalid mediaId format -> 400
  const invalidIdRes = await fetch(`${BASE_URL}/api/artists/me/media/not-an-id`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  assertTest('Invalid media ID format returns 400', invalidIdRes.status === 400);

  // 6.2 Non-existent mediaId -> 404
  const randomId = new mongoose.Types.ObjectId();
  const nonExistentRes = await fetch(`${BASE_URL}/api/artists/me/media/${randomId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  assertTest('Non-existent media ID returns 404', nonExistentRes.status === 404);

  // 6.3 Another artist attempting to delete this artist's media -> 404 (isolation enforced)
  const unauthorizedDeleteRes = await fetch(`${BASE_URL}/api/artists/me/media/${createdMediaId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokens.anotherArtist}` }
  });
  assertTest('Another artist attempting to delete returns 404 (cannot delete another artist\'s media)', 
    unauthorizedDeleteRes.status === 404
  );

  // Verify media is still intact in DB
  const artistBeforeDelete = await Artist.findById(seededArtist._id);
  assertTest('Media still remains after unauthorized delete attempt', 
    artistBeforeDelete.media.some(m => m._id.toString() === createdMediaId)
  );

  // 6.4 Valid delete by the owning artist
  const validDeleteRes = await fetch(`${BASE_URL}/api/artists/me/media/${createdMediaId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  const validDeleteData = await validDeleteRes.json();
  assertTest('Owner deleting media returns 200 OK', validDeleteRes.status === 200);
  assertTest('Delete response indicates success', validDeleteData.success === true);

  // Verify media removed from DB
  const artistAfterDelete = await Artist.findById(seededArtist._id);
  assertTest('Media is removed from MongoDB artist document', 
    !artistAfterDelete.media.some(m => m._id.toString() === createdMediaId)
  );
}

async function teardown() {
  console.log('\n--- Cleaning up Test Environment ---');
  if (testUsers.artist) {
    await User.deleteMany({ email: /@test-tvarita\.local$/ });
    await Artist.deleteMany({ displayName: /Test Artist/ });
    await ArtForm.deleteMany({ slug: /test-art-form/ });
  }

  await new Promise((resolve) => {
    if (server) {
      server.close(resolve);
    } else {
      resolve();
    }
  });

  await mongoose.disconnect();
  console.log('MongoDB disconnected & test server stopped.');

  console.log('\n==================================================');
  console.log(`TOTAL TESTS: ${passedCount + failedCount}`);
  console.log(`PASSED: ${passedCount}`);
  console.log(`FAILED: ${failedCount}`);
  console.log('==================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

async function main() {
  try {
    await setup();
    await runTests();
  } catch (error) {
    console.error('Fatal Test Error:', error);
    failedCount++;
  } finally {
    await teardown();
  }
}

main();
