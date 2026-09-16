const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const User = require('../src/models/User');
const Artist = require('../src/models/Artist');
const ArtForm = require('../src/models/ArtForm');
const Event = require('../src/models/Event');
const Product = require('../src/models/Product');
const KnowledgeItem = require('../src/models/KnowledgeItem');
const {
  ROLES,
  ARTIST_VERIFICATION_STATUS,
  PRODUCT_STATUS,
  PRODUCT_MODERATION_STATUS,
  EVENT_STATUS
} = require('../src/constants');

const TEST_PORT = 5088;
const BASE_URL = `http://localhost:${TEST_PORT}`;
const JWT_SECRET = process.env.JWT_SECRET || 'tvarita_super_secret_jwt_key_2026_dev';

let server;
let testUsers = {};
let tokens = {};
let testArtForm;
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

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

async function setup() {
  console.log('\n--- Setting up Admin Artist Onboarding Test Environment ---');
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tvarita';
  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB.');

  // Pre-test cleanup: ensure no lingering records from interrupted previous runs
  await Artist.deleteMany({ displayName: { $regex: /(Sukhnandi|Gond|Lado Bai|Bhuri Bai|Direct Login|Jangarh)/i } });
  await ArtForm.deleteMany({ slug: { $regex: /kalamkari-onboard/i } });
  await Product.deleteMany({ title: { $regex: /(Sacred Mahua|Clay Pot|Forest Bird)/i } });
  await Event.deleteMany({ title: { $regex: /(Pigment Workshop|Folk Art)/i } });
  await KnowledgeItem.deleteMany({ title: { $regex: /(Origins of Gond|Natural Pigments)/i } });

  const passwordHash = await bcrypt.hash('Password@123', 10);

  // 1. Admin User
  testUsers.admin = await User.create({
    name: 'Tvarita Admin Lead',
    email: `admin_onboard_${Date.now()}@tvarita.com`,
    passwordHash,
    role: ROLES.ADMIN,
    status: 'active'
  });
  tokens.admin = generateToken(testUsers.admin);

  // 2. Artist User (with login account)
  testUsers.artist = await User.create({
    name: 'Direct Login Artist',
    email: `artist_direct_${Date.now()}@tvarita.com`,
    passwordHash,
    role: ROLES.ARTIST,
    status: 'active'
  });
  tokens.artist = generateToken(testUsers.artist);

  // 3. Regular Public User
  testUsers.public = await User.create({
    name: 'Civilian Fan',
    email: `public_fan_${Date.now()}@gmail.com`,
    passwordHash,
    role: ROLES.PUBLIC,
    status: 'active'
  });
  tokens.public = generateToken(testUsers.public);

  // 4. Institution User
  testUsers.institution = await User.create({
    name: 'Heritage Foundation',
    email: `inst_onboard_${Date.now()}@heritage.org`,
    passwordHash,
    role: ROLES.INSTITUTION,
    status: 'active'
  });
  tokens.institution = generateToken(testUsers.institution);

  // Test Art Form
  testArtForm = await ArtForm.create({
    name: `Kalamkari Onboard ${Date.now()}`,
    slug: `kalamkari-onboard-${Date.now()}`,
    description: 'Hand-painted or block-printed cotton textile art',
    regions: ['Andhra Pradesh']
  });

  // Start test server on dedicated port 5088
  await new Promise((resolve) => {
    server = app.listen(TEST_PORT, () => {
      console.log(`Test server running on port ${TEST_PORT}`);
      resolve();
    });
  });
}

async function runTests() {
  console.log('\n====================================================');
  console.log('STARTING TESTS: TVARITA ADMIN ARTIST ONBOARDING & MULTI-CHANNEL');
  console.log('====================================================');

  let adminCreatedArtistNoUser;
  let adminCreatedArtistWithUser;

  // =========================================================
  // 1. ADMIN CREATE ARTIST WITHOUT USER ACCOUNT
  // =========================================================
  console.log('\n--- 1. ADMIN CREATE ARTIST WITHOUT USER ACCOUNT ---');

  const createNoUserRes = await fetch(`${BASE_URL}/api/admin/artists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({
      displayName: 'Master Gond Elder Sukhnandi',
      bio: 'Master traditional tribal muralist from Dindori',
      artFormIds: [testArtForm._id],
      location: 'Dindori, Madhya Pradesh',
      languages: ['Gondi', 'Hindi'],
      experience: 45,
      verificationStatus: 'approved'
    })
  });
  const createNoUserData = await createNoUserRes.json();

  assertTest('Admin can create Artist without User account (201)', createNoUserRes.status === 201);
  assertTest('Created artist displayName matches', createNoUserData.data?.displayName === 'Master Gond Elder Sukhnandi');
  assertTest('Artist hasUserAccount is false', createNoUserData.data?.hasUserAccount === false);
  assertTest('Artist userId is not set', !createNoUserData.data?.userId);
  assertTest('Profile completeness is calculated (> 50%)', createNoUserData.data?.profileCompleteness > 50);

  adminCreatedArtistNoUser = createNoUserData.data;

  // Verify NO fake User was created
  const fakeUserSearch = await User.findOne({ name: 'Master Gond Elder Sukhnandi' });
  assertTest('Zero fake User accounts created in database', fakeUserSearch === null);

  // 1.2 Invalid artist data rejected
  const invalidArtistRes = await fetch(`${BASE_URL}/api/admin/artists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({
      displayName: '', // empty name
      verificationStatus: 'unsupported_status'
    })
  });
  assertTest('Invalid artist data is rejected with 400', invalidArtistRes.status === 400);

  // =========================================================
  // 2. ADMIN CREATE ARTIST WITH USER ACCOUNT
  // =========================================================
  console.log('\n--- 2. ADMIN CREATE ARTIST WITH USER ACCOUNT ---');

  const createWithUserRes = await fetch(`${BASE_URL}/api/admin/artists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({
      userId: testUsers.artist._id,
      displayName: 'Direct Login Artist Profile',
      bio: 'Practicing artisan with web account',
      artFormIds: [testArtForm._id],
      location: { city: 'Hyderabad', state: 'Telangana' },
      languages: ['Telugu', 'English'],
      experience: 12,
      verificationStatus: 'approved'
    })
  });
  const createWithUserData = await createWithUserRes.json();

  assertTest('Admin can create Artist linked to existing User (201)', createWithUserRes.status === 201);
  assertTest('Artist hasUserAccount is true', createWithUserData.data?.hasUserAccount === true);
  assertTest('Artist userId is set to linked user ID', Boolean(createWithUserData.data?.userId));

  adminCreatedArtistWithUser = createWithUserData.data;

  // =========================================================
  // 3. DIRECT ARTIST LOGIN & DASHBOARD APIs STILL WORK
  // =========================================================
  console.log('\n--- 3. DIRECT ARTIST LOGIN & DASHBOARD APIs ---');

  // Authenticated artist accessing /api/artists/me
  const ownProfileRes = await fetch(`${BASE_URL}/api/artists/me`, {
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  const ownProfileData = await ownProfileRes.json();

  assertTest('Direct artist login /api/artists/me returns 200', ownProfileRes.status === 200);
  assertTest('Artist gets their own profile', ownProfileData.data?.displayName === 'Direct Login Artist Profile');

  // Artist editing own profile
  const editOwnRes = await fetch(`${BASE_URL}/api/artists/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.artist}`
    },
    body: JSON.stringify({
      experience: 14
    })
  });
  const editOwnData = await editOwnRes.json();
  assertTest('Artist can update own profile fields (200)', editOwnRes.status === 200);
  assertTest('Own experience updated to 14', editOwnData.data?.experience === 14);

  // Artist ownership protection: tampering with userId
  const tamperRes = await fetch(`${BASE_URL}/api/artists/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.artist}`
    },
    body: JSON.stringify({
      userId: testUsers.admin._id
    })
  });
  assertTest('Artist attempting to tamper with userId is rejected (400)', tamperRes.status === 400);

  // =========================================================
  // 4. ADMIN MANAGEMENT FOR BOTH ARTIST TYPES
  // =========================================================
  console.log('\n--- 4. ADMIN MANAGEMENT FOR BOTH ARTIST TYPES ---');

  // 4.1 Admin edits artist without user account
  const patchNoUserRes = await fetch(`${BASE_URL}/api/admin/artists/${adminCreatedArtistNoUser._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({
      experience: 50,
      bio: 'Master traditional tribal muralist with national recognition'
    })
  });
  const patchNoUserData = await patchNoUserRes.json();
  assertTest('Admin can edit artist without User account (200)', patchNoUserRes.status === 200);
  assertTest('Experience updated to 50', patchNoUserData.data?.experience === 50);

  // 4.2 Admin filters by hasUserAccount
  const filterNoUserRes = await fetch(`${BASE_URL}/api/admin/artists?hasUserAccount=false`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const filterNoUserData = await filterNoUserRes.json();
  assertTest('Admin can filter artists by hasUserAccount=false', filterNoUserRes.status === 200);
  assertTest('Found un-accounted artist in list', filterNoUserData.data?.artists?.some(a => a._id === adminCreatedArtistNoUser._id));

  const filterHasUserRes = await fetch(`${BASE_URL}/api/admin/artists?hasUserAccount=true`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const filterHasUserData = await filterHasUserRes.json();
  assertTest('Admin can filter artists by hasUserAccount=true', filterHasUserRes.status === 200);
  assertTest('Found accounted artist in list', filterHasUserData.data?.artists?.some(a => a._id === adminCreatedArtistWithUser._id));

  // =========================================================
  // 5. ADMIN MANAGES CONTENT FOR ARTIST WITHOUT ACCOUNT
  // =========================================================
  console.log('\n--- 5. ADMIN MANAGES CONTENT FOR ARTIST WITHOUT ACCOUNT ---');

  // 5.1 Admin creates product for artist without user account
  const adminProdRes = await fetch(`${BASE_URL}/api/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({
      artistId: adminCreatedArtistNoUser._id,
      artFormId: testArtForm._id,
      title: 'Sacred Mahua Tree Canvas',
      description: 'Hand-painted natural pigment acrylic on cotton canvas',
      price: 18000,
      stock: 2,
      status: 'active',
      moderationStatus: 'approved'
    })
  });
  const adminProdData = await adminProdRes.json();
  assertTest('Admin can create product for artist without user account (201)', adminProdRes.status === 201);
  assertTest('Product correctly references artist', adminProdData.data?.artistId?._id === adminCreatedArtistNoUser._id);

  // 5.2 Admin creates event for artist without user account
  const adminEventRes = await fetch(`${BASE_URL}/api/admin/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({
      title: 'Traditional Gond Pigment Workshop',
      artistIds: [adminCreatedArtistNoUser._id],
      dateTime: new Date(Date.now() + 86400000 * 14).toISOString(),
      capacity: 25,
      price: 1500,
      status: 'published'
    })
  });
  const adminEventData = await adminEventRes.json();
  assertTest('Admin can create event for artist without user account (201)', adminEventRes.status === 201);
  assertTest('Event status is published', adminEventData.data?.status === 'published');

  // =========================================================
  // 6. BULK ARTIST IMPORT VIA CSV
  // =========================================================
  console.log('\n--- 6. BULK ARTIST IMPORT VIA CSV ---');

  const sampleArtistCsv = `displayName,bio,artForms,location,languages,experience,availability,verificationStatus
"Elder Jangarh Shyam","Master Pardhan Gond artist","${testArtForm.name}","Dindori, Madhya Pradesh","Gondi;Hindi","35 years","available","approved"
"Lado Bai","Bhils traditional wall painter","${testArtForm.name}","Jhabua, Madhya Pradesh","Bhil;Hindi","40 years","available","approved"
"Bhuri Bai","First tribal artist to paint on canvas","${testArtForm.name}","Pitol, Madhya Pradesh","Bhil;Hindi","45 years","available","approved"
`;

  // 6.1 Non-admin cannot bulk import
  const pubBulkRes = await fetch(`${BASE_URL}/api/admin/artists/bulk-import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.public}`
    },
    body: JSON.stringify({ csvData: sampleArtistCsv })
  });
  assertTest('Non-admin rejected from bulk import (403)', pubBulkRes.status === 403);

  // 6.2 Admin performs valid bulk import
  const adminBulkRes = await fetch(`${BASE_URL}/api/admin/artists/bulk-import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ csvData: sampleArtistCsv })
  });
  const adminBulkData = await adminBulkRes.json();

  assertTest('Admin bulk import returns 200 OK', adminBulkRes.status === 200);
  assertTest('Summary reports totalRows = 3', adminBulkData.data?.totalRows === 3);
  assertTest('Summary reports created = 3', adminBulkData.data?.created === 3);
  assertTest('Summary reports failed = 0', adminBulkData.data?.failed === 0);

  // 6.3 Duplicate detection on re-upload
  const dupBulkRes = await fetch(`${BASE_URL}/api/admin/artists/bulk-import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ csvData: sampleArtistCsv })
  });
  const dupBulkData = await dupBulkRes.json();

  assertTest('Re-import detects existing artists without creating duplicates', dupBulkRes.status === 200);
  assertTest('Duplicate rows updated rather than duplicated (updated >= 3)', dupBulkData.data?.updated >= 3);
  assertTest('Zero new records created on duplicate upload', dupBulkData.data?.created === 0);

  // 6.4 Row-level error reporting on invalid CSV row
  const invalidCsv = `displayName,bio,artForms,location,languages,experience,availability,verificationStatus
"","Missing Name Artist","${testArtForm.name}","Bhopal","Hindi","10","available","approved"
"Valid Artist Row","Valid Bio","InvalidArtFormNonexistent","Bhopal","Hindi","10","available","approved"
"Valid Artist Row 2","Valid Bio","${testArtForm.name}","Bhopal","Hindi","10","available","invalid_status"
`;
  const invalidBulkRes = await fetch(`${BASE_URL}/api/admin/artists/bulk-import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ csvData: invalidCsv })
  });
  const invalidBulkData = await invalidBulkRes.json();

  assertTest('Row-level errors captured (failed = 3)', invalidBulkData.data?.failed === 3);
  assertTest('Specific row-level error details provided', invalidBulkData.data?.errors?.length === 3);
  assertTest('Row 2 missing displayName reported', invalidBulkData.data?.errors?.some(e => e.field === 'displayName'));
  assertTest('Row 3 invalid art form reported', invalidBulkData.data?.errors?.some(e => e.field === 'artForms'));
  assertTest('Row 4 invalid verificationStatus reported', invalidBulkData.data?.errors?.some(e => e.field === 'verificationStatus'));

  // =========================================================
  // 7. BULK PRODUCT & EVENT & KNOWLEDGE IMPORTS
  // =========================================================
  console.log('\n--- 7. BULK PRODUCT, EVENT & KNOWLEDGE IMPORTS ---');

  // 7.1 Bulk product import
  const productCsv = `artistId,artFormId,title,description,price,stock,status,moderationStatus
"${adminCreatedArtistNoUser._id}","${testArtForm._id}","Tribal Clay Pot","Handmade earthenware",1200,5,"active","approved"
"${adminCreatedArtistNoUser._id}","${testArtForm._id}","Forest Bird Scroll","Natural dye on paper",3500,2,"active","approved"
`;
  const bulkProdRes = await fetch(`${BASE_URL}/api/admin/products/bulk-import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ csvData: productCsv })
  });
  const bulkProdData = await bulkProdRes.json();
  assertTest('Admin can bulk import products (200)', bulkProdRes.status === 200);
  assertTest('Products created count is 2', bulkProdData.data?.created === 2);

  // 7.2 Bulk event import
  const eventCsv = `artistId,title,dateTime,capacity,price,location,city,status
"${adminCreatedArtistNoUser._id}","Folk Art Intensive Workshop","2026-10-15T10:00:00Z",20,1000,"Community Center","Bhopal","published"
`;
  const bulkEventRes = await fetch(`${BASE_URL}/api/admin/events/bulk-import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ csvData: eventCsv })
  });
  const bulkEventData = await bulkEventRes.json();
  assertTest('Admin can bulk import events (200)', bulkEventRes.status === 200);
  assertTest('Events created count is 1', bulkEventData.data?.created === 1);

  // 7.3 Bulk knowledge import
  const knowledgeCsv = `title,content,summary,language,type,status
"Origins of Gond Painting","Detailed historical essay on Gond wall art origins and symbolism","Gond history summary","en","article","published"
"Natural Pigments Preparation","Guide to extracting colors from soil and leaves","Pigment guide","en","technique","published"
`;
  const bulkKnowRes = await fetch(`${BASE_URL}/api/admin/knowledge/bulk-import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ csvData: knowledgeCsv })
  });
  const bulkKnowData = await bulkKnowRes.json();
  assertTest('Admin can bulk import cultural knowledge entries (200)', bulkKnowRes.status === 200);
  assertTest('Knowledge entries created count is 2', bulkKnowData.data?.created === 2);

  // =========================================================
  // 8. SECURITY & DATA PRIVACY
  // =========================================================
  console.log('\n--- 8. SECURITY & DATA PRIVACY ---');

  // Unauthenticated blocked
  const unauthRes = await fetch(`${BASE_URL}/api/admin/artists/bulk-import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ csvData: sampleArtistCsv })
  });
  assertTest('Unauthenticated access blocked from bulk import (401)', unauthRes.status === 401);

  // Institution blocked
  const instBulkRes = await fetch(`${BASE_URL}/api/admin/artists/bulk-import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.institution}`
    },
    body: JSON.stringify({ csvData: sampleArtistCsv })
  });
  assertTest('Institution role blocked from bulk import (403)', instBulkRes.status === 403);

  // Artist blocked
  const artistBulkRes = await fetch(`${BASE_URL}/api/admin/artists/bulk-import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.artist}`
    },
    body: JSON.stringify({ csvData: sampleArtistCsv })
  });
  assertTest('Artist role blocked from admin bulk import (403)', artistBulkRes.status === 403);
}

async function cleanup() {
  console.log('\n--- Cleaning up Test Data ---');
  try {
    const userIds = Object.values(testUsers).map(u => u._id);
    await User.deleteMany({ _id: { $in: userIds } });
    await Artist.deleteMany({ displayName: { $regex: /(Sukhnandi|Gond|Lado Bai|Bhuri Bai|Direct Login|Jangarh)/i } });
    await ArtForm.deleteMany({ slug: { $regex: /kalamkari-onboard/i } });
    await Product.deleteMany({ title: { $regex: /(Sacred Mahua|Clay Pot|Forest Bird)/i } });
    await Event.deleteMany({ title: { $regex: /(Pigment Workshop|Folk Art)/i } });
    await KnowledgeItem.deleteMany({ title: { $regex: /(Origins of Gond|Natural Pigments)/i } });
  } catch (err) {
    console.warn('Cleanup warning:', err.message);
  }

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.disconnect();
  console.log('MongoDB disconnected & test server stopped.');
}

async function main() {
  try {
    await setup();
    await runTests();
  } catch (err) {
    console.error('Fatal error during test run:', err);
    failedCount++;
  } finally {
    await cleanup();
    console.log('\n====================================================');
    console.log(`ADMIN ARTIST ONBOARDING TESTS: ${passedCount + failedCount}`);
    console.log(`PASSED: ${passedCount}`);
    console.log(`FAILED: ${failedCount}`);
    console.log('====================================================\n');
    process.exit(failedCount === 0 ? 0 : 1);
  }
}

main();
