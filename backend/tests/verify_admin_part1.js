const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const User = require('../src/models/User');
const Artist = require('../src/models/Artist');
const ArtForm = require('../src/models/ArtForm');
const Event = require('../src/models/Event');
const Product = require('../src/models/Product');
const Booking = require('../src/models/Booking');
const Order = require('../src/models/Order');
const Follow = require('../src/models/Follow');
const Request = require('../src/models/Request');
const {
  ROLES,
  ARTIST_VERIFICATION_STATUS,
  EVENT_STATUS,
  PRODUCT_STATUS,
  PRODUCT_MODERATION_STATUS,
  BOOKING_STATUS,
  ORDER_STATUS
} = require('../src/constants');

const TEST_PORT = 5086;
const BASE_URL = `http://localhost:${TEST_PORT}`;
const JWT_SECRET = process.env.JWT_SECRET || 'tvarita_super_secret_jwt_key_2026_dev';

let server;
let testUsers = {};
let tokens = {};
let testArtForm;
let testArtist;
let testEvent;

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
  console.log('\n--- Setting up Admin Part 1 Test Environment ---');
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tvarita';
  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB.');

  // Clean test documents
  await User.deleteMany({ email: /@test-admin-part1\.local$/ });
  await Artist.deleteMany({ displayName: /Admin Test Artist/ });
  await ArtForm.deleteMany({ slug: /admin-test-art-form/ });
  await Event.deleteMany({ title: /Admin Test Event/ });
  await Booking.deleteMany({ bookingCode: /ADM-BK/ });
  await Order.deleteMany({ orderNumber: /ADM-ORD/ });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  // 1. Admin user
  testUsers.admin = await User.create({
    name: 'Admin Chief',
    email: 'admin@test-admin-part1.local',
    passwordHash,
    role: ROLES.ADMIN
  });
  tokens.admin = generateToken(testUsers.admin);

  // 2. Artist user
  testUsers.artist = await User.create({
    name: 'Gond Painter',
    email: 'artist@test-admin-part1.local',
    passwordHash,
    role: ROLES.ARTIST
  });
  tokens.artist = generateToken(testUsers.artist);

  // 3. Public user
  testUsers.public = await User.create({
    name: 'Public Fan',
    email: 'public@test-admin-part1.local',
    passwordHash,
    role: ROLES.PUBLIC
  });
  tokens.public = generateToken(testUsers.public);

  // 4. Institution user
  testUsers.institution = await User.create({
    name: 'Heritage College',
    email: 'college@test-admin-part1.local',
    passwordHash,
    role: ROLES.INSTITUTION
  });
  tokens.institution = generateToken(testUsers.institution);

  // Seed ArtForm
  testArtForm = await ArtForm.create({
    name: 'Gond Folk Art',
    slug: 'gond-folk-art-admin-test-art-form',
    description: 'Indigenous art of Madhya Pradesh',
    regions: ['Madhya Pradesh'],
    status: 'active'
  });

  // Seed Artist
  testArtist = await Artist.create({
    userId: testUsers.artist._id,
    displayName: 'Admin Test Artist Bhajju',
    bio: 'Renowned Gond artist',
    artFormIds: [testArtForm._id],
    location: { city: 'Bhopal', state: 'Madhya Pradesh', country: 'India' },
    verificationStatus: ARTIST_VERIFICATION_STATUS.PENDING
  });

  // Seed Event
  testEvent = await Event.create({
    title: 'Admin Test Event Gond Workshop',
    type: 'workshop',
    artistIds: [testArtist._id],
    createdBy: testUsers.admin._id,
    artFormIds: [testArtForm._id],
    dateTime: new Date(Date.now() + 86400000 * 5),
    capacity: 20,
    price: 600,
    status: EVENT_STATUS.PUBLISHED
  });

  // Seed Booking
  await Booking.create({
    bookingCode: 'ADM-BK-001',
    userId: testUsers.public._id,
    eventId: testEvent._id,
    artistId: testArtist._id,
    quantity: 1,
    amount: 600,
    status: BOOKING_STATUS.CONFIRMED
  });

  // Start test server
  await new Promise((resolve) => {
    server = app.listen(TEST_PORT, () => {
      console.log(`Test server running on port ${TEST_PORT}\n`);
      resolve();
    });
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('STARTING TESTS: ADMIN BACKEND — PART 1');
  console.log('====================================================\n');

  // =========================================================
  // 1. AUTHORIZATION & ROLE RESTRICTION CHECKS
  // =========================================================
  console.log('--- 1. ADMIN AUTHORIZATION & ACCESS CONTROL ---');

  // 1.1 Unauthenticated -> 401
  const noTokenRes = await fetch(`${BASE_URL}/api/admin/dashboard`);
  assertTest('Unauthenticated access to /api/admin/dashboard returns 401', noTokenRes.status === 401);

  // 1.2 Public user -> 403
  const pubRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${tokens.public}` }
  });
  assertTest('Public user receives 403 Forbidden for admin endpoint', pubRes.status === 403);

  // 1.3 Institution user -> 403
  const instRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${tokens.institution}` }
  });
  assertTest('Institution user receives 403 Forbidden for admin endpoint', instRes.status === 403);

  // 1.4 Artist user -> 403
  const artistRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  assertTest('Artist user receives 403 Forbidden for admin endpoint', artistRes.status === 403);

  // 1.5 Admin user -> 200
  const adminRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  assertTest('Admin user receives 200 OK for admin endpoint', adminRes.status === 200);

  // =========================================================
  // 2. ADMIN DASHBOARD
  // =========================================================
  console.log('\n--- 2. ADMIN DASHBOARD ---');
  const dashData = await adminRes.json();
  assertTest('Dashboard returns users count >= 4', dashData.data?.users >= 4);
  assertTest('Dashboard returns artists count >= 1', dashData.data?.artists >= 1);
  assertTest('Dashboard returns artForms count >= 1', dashData.data?.artForms >= 1);
  assertTest('Dashboard returns events count >= 1', dashData.data?.events >= 1);
  assertTest('Dashboard returns bookings count >= 1', dashData.data?.bookings >= 1);

  // =========================================================
  // 3. ADMIN ANALYTICS
  // =========================================================
  console.log('\n--- 3. ADMIN ANALYTICS ---');

  // 3.1 Overview
  const overRes = await fetch(`${BASE_URL}/api/admin/analytics/overview`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const overData = await overRes.json();
  assertTest('GET /api/admin/analytics/overview returns 200', overRes.status === 200);
  assertTest('Overview contains usersByRole', Boolean(overData.data?.usersByRole));
  assertTest('Overview contains financials.bookingRevenue', overData.data?.financials?.bookingRevenue >= 600);

  // 3.2 Artists Analytics
  const artAnalyticRes = await fetch(`${BASE_URL}/api/admin/analytics/artists`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const artAnalyticData = await artAnalyticRes.json();
  assertTest('GET /api/admin/analytics/artists returns 200', artAnalyticRes.status === 200);
  assertTest('Artists analytics contains statusBreakdown', Boolean(artAnalyticData.data?.statusBreakdown));

  // 3.3 Art Forms Analytics
  const afAnalyticRes = await fetch(`${BASE_URL}/api/admin/analytics/art-forms`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const afAnalyticData = await afAnalyticRes.json();
  assertTest('GET /api/admin/analytics/art-forms returns 200', afAnalyticRes.status === 200);
  assertTest('Art-form analytics lists art forms', Array.isArray(afAnalyticData.data?.artForms));

  // 3.4 Engagement Analytics
  const engRes = await fetch(`${BASE_URL}/api/admin/analytics/engagement`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const engData = await engRes.json();
  assertTest('GET /api/admin/analytics/engagement returns 200', engRes.status === 200);
  assertTest('Engagement returns totalFollows', typeof engData.data?.totalFollows === 'number');

  // 3.5 Revenue Analytics
  const revRes = await fetch(`${BASE_URL}/api/admin/analytics/revenue`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const revData = await revRes.json();
  assertTest('GET /api/admin/analytics/revenue returns 200', revRes.status === 200);
  assertTest('Revenue analytics calculates booking revenue >= 600', revData.data?.breakdown?.bookings?.paid >= 600);

  // =========================================================
  // 4. ADMIN USERS
  // =========================================================
  console.log('\n--- 4. ADMIN USERS ---');

  // 4.1 GET /api/admin/users
  const getUsersRes = await fetch(`${BASE_URL}/api/admin/users?role=artist`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const getUsersData = await getUsersRes.json();
  assertTest('GET /api/admin/users with filter returns 200', getUsersRes.status === 200);
  assertTest('Filtered users returns artist accounts', getUsersData.data?.users?.some(u => u.role === 'artist'));
  assertTest('passwordHash is NOT exposed in response', getUsersData.data?.users?.every(u => !u.passwordHash));

  // 4.2 GET /api/admin/users/:id
  const getSingleUserRes = await fetch(`${BASE_URL}/api/admin/users/${testUsers.public._id}`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const getSingleUserData = await getSingleUserRes.json();
  assertTest('GET /api/admin/users/:id returns 200', getSingleUserRes.status === 200);
  assertTest('Returns correct user details', getSingleUserData.data?.name === 'Public Fan');

  // 4.3 Self-demotion / self-suspension block
  const selfDemoteRes = await fetch(`${BASE_URL}/api/admin/users/${testUsers.admin._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ role: 'public' })
  });
  assertTest('Admin attempting to self-demote role is rejected (400)', selfDemoteRes.status === 400);

  // 4.4 Valid PATCH /api/admin/users/:id
  const updateUserRes = await fetch(`${BASE_URL}/api/admin/users/${testUsers.public._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ name: 'Public Fan Updated' })
  });
  const updateUserData = await updateUserRes.json();
  assertTest('PATCH /api/admin/users/:id updates user name', updateUserData.data?.name === 'Public Fan Updated');

  // 4.5 Self-deactivation block
  const selfDeleteRes = await fetch(`${BASE_URL}/api/admin/users/${testUsers.admin._id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  assertTest('Admin attempting to self-deactivate is rejected (400)', selfDeleteRes.status === 400);

  // 4.6 DELETE /api/admin/users/:id (Deactivate)
  const deactivateRes = await fetch(`${BASE_URL}/api/admin/users/${testUsers.public._id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  assertTest('DELETE /api/admin/users/:id deactivates user (200)', deactivateRes.status === 200);

  // =========================================================
  // 5. ADMIN ARTISTS
  // =========================================================
  console.log('\n--- 5. ADMIN ARTISTS ---');

  // 5.1 GET /api/admin/artists
  const getArtistsRes = await fetch(`${BASE_URL}/api/admin/artists?verificationStatus=pending`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const getArtistsData = await getArtistsRes.json();
  assertTest('GET /api/admin/artists with status filter returns 200', getArtistsRes.status === 200);
  assertTest('Returns the pending artist', getArtistsData.data?.artists?.some(a => a._id === testArtist._id.toString()));

  // 5.2 GET /api/admin/artists/:id
  const getSingleArtistRes = await fetch(`${BASE_URL}/api/admin/artists/${testArtist._id}`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const getSingleArtistData = await getSingleArtistRes.json();
  assertTest('GET /api/admin/artists/:id returns 200', getSingleArtistRes.status === 200);
  assertTest('Artist displayName matches', getSingleArtistData.data?.displayName === 'Admin Test Artist Bhajju');

  // 5.3 POST /api/admin/artists/:id/approve
  const approveRes = await fetch(`${BASE_URL}/api/admin/artists/${testArtist._id}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const approveData = await approveRes.json();
  assertTest('POST /api/admin/artists/:id/approve returns 200', approveRes.status === 200);
  assertTest('Artist status updated to "approved"', approveData.data?.verificationStatus === 'approved');

  // 5.4 POST /api/admin/artists/:id/reject
  const rejectRes = await fetch(`${BASE_URL}/api/admin/artists/${testArtist._id}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ reason: 'Insufficient documentary evidence' })
  });
  const rejectData = await rejectRes.json();
  assertTest('POST /api/admin/artists/:id/reject returns 200', rejectRes.status === 200);
  assertTest('Artist status updated to "rejected"', rejectData.data?.verificationStatus === 'rejected');
  assertTest('Rejection reason stored', rejectData.data?.rejectionReason === 'Insufficient documentary evidence');

  // 5.5 PATCH /api/admin/artists/:id
  const patchArtistRes = await fetch(`${BASE_URL}/api/admin/artists/${testArtist._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ experience: 15, verificationStatus: 'approved' })
  });
  const patchArtistData = await patchArtistRes.json();
  assertTest('PATCH /api/admin/artists/:id updates experience and status', 
    patchArtistData.data?.experience === 15 && patchArtistData.data?.verificationStatus === 'approved'
  );

  // =========================================================
  // 6. ADMIN ART FORMS
  // =========================================================
  console.log('\n--- 6. ADMIN ART FORMS ---');

  // 6.1 POST /api/admin/art-forms
  const createArtFormRes = await fetch(`${BASE_URL}/api/admin/art-forms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({
      name: 'Madhubani Mithila Art admin-test-art-form',
      description: 'Ancient folk art from Bihar',
      regions: ['Bihar']
    })
  });
  const createArtFormData = await createArtFormRes.json();
  assertTest('POST /api/admin/art-forms creates new art form (201)', createArtFormRes.status === 201);
  assertTest('Auto-generated slug exists', Boolean(createArtFormData.data?.slug));
  const newArtFormId = createArtFormData.data?._id;

  // 6.2 Duplicate slug rejection
  const dupSlugRes = await fetch(`${BASE_URL}/api/admin/art-forms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({
      name: 'Madhubani Mithila Art admin-test-art-form'
    })
  });
  assertTest('Duplicate slug creation is rejected with 400', dupSlugRes.status === 400);

  // 6.3 GET /api/admin/art-forms
  const getArtFormsRes = await fetch(`${BASE_URL}/api/admin/art-forms`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const getArtFormsData = await getArtFormsRes.json();
  assertTest('GET /api/admin/art-forms returns 200', getArtFormsRes.status === 200);
  assertTest('List includes new art form', getArtFormsData.data?.artForms?.some(af => af._id === newArtFormId));

  // 6.4 PATCH /api/admin/art-forms/:id
  const patchArtFormRes = await fetch(`${BASE_URL}/api/admin/art-forms/${newArtFormId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ description: 'Updated Mithila description' })
  });
  const patchArtFormData = await patchArtFormRes.json();
  assertTest('PATCH /api/admin/art-forms/:id updates description', patchArtFormData.data?.description === 'Updated Mithila description');

  // 6.5 DELETE /api/admin/art-forms/:id with active reference (testArtForm is referenced by testArtist)
  const deleteReferencedAfRes = await fetch(`${BASE_URL}/api/admin/art-forms/${testArtForm._id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const deleteReferencedAfData = await deleteReferencedAfRes.json();
  assertTest('Deleting referenced art form archives it instead of hard delete (status: inactive)', 
    deleteReferencedAfData.data?.status === 'inactive'
  );

  // 6.6 DELETE /api/admin/art-forms/:id with no references (newArtFormId has no references)
  const deleteUnreferencedAfRes = await fetch(`${BASE_URL}/api/admin/art-forms/${newArtFormId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  assertTest('Deleting unreferenced art form hard deletes cleanly (200)', deleteUnreferencedAfRes.status === 200);

  // =========================================================
  // 7. ADMIN EVENTS
  // =========================================================
  console.log('\n--- 7. ADMIN EVENTS ---');

  // 7.1 POST /api/admin/events (Admin can directly publish)
  const createEventRes = await fetch(`${BASE_URL}/api/admin/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({
      title: 'Admin Test Event Master Gathering',
      type: 'exhibition',
      artistIds: [testArtist._id],
      artFormIds: [testArtForm._id],
      dateTime: new Date(Date.now() + 86400000 * 20),
      capacity: 50,
      price: 1200,
      status: 'published'
    })
  });
  const createEventData = await createEventRes.json();
  assertTest('POST /api/admin/events allows admin to create & publish event (201)', createEventRes.status === 201);
  assertTest('Event status is "published"', createEventData.data?.status === 'published');
  const adminCreatedEventId = createEventData.data?._id;

  // 7.2 GET /api/admin/events
  const getEventsRes = await fetch(`${BASE_URL}/api/admin/events`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const getEventsData = await getEventsRes.json();
  assertTest('GET /api/admin/events returns 200', getEventsRes.status === 200);
  assertTest('List includes created event', getEventsData.data?.events?.some(e => e._id === adminCreatedEventId));

  // 7.3 PATCH /api/admin/events/:id
  const patchEventRes = await fetch(`${BASE_URL}/api/admin/events/${adminCreatedEventId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ price: 1500, capacity: 60 })
  });
  const patchEventData = await patchEventRes.json();
  assertTest('PATCH /api/admin/events/:id updates price and capacity', 
    patchEventData.data?.price === 1500 && patchEventData.data?.capacity === 60
  );

  // 7.4 DELETE /api/admin/events/:id with bookings (testEvent has booking ADM-BK-001)
  const deleteWithBookingsRes = await fetch(`${BASE_URL}/api/admin/events/${testEvent._id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const deleteWithBookingsData = await deleteWithBookingsRes.json();
  assertTest('Deleting event with bookings cancels event rather than hard delete (status: cancelled)', 
    deleteWithBookingsData.data?.status === 'cancelled'
  );

  // 7.5 DELETE /api/admin/events/:id without bookings (adminCreatedEventId has no bookings)
  const deleteWithoutBookingsRes = await fetch(`${BASE_URL}/api/admin/events/${adminCreatedEventId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  assertTest('Deleting event without bookings hard deletes cleanly (200)', deleteWithoutBookingsRes.status === 200);
}

async function teardown() {
  console.log('\n--- Cleaning up Admin Test Data ---');
  await User.deleteMany({ email: /@test-admin-part1\.local$/ });
  await Artist.deleteMany({ displayName: /Admin Test Artist/ });
  await ArtForm.deleteMany({ slug: /admin-test-art-form/ });
  await Event.deleteMany({ title: /Admin Test Event/ });
  await Booking.deleteMany({ bookingCode: /ADM-BK/ });
  await Order.deleteMany({ orderNumber: /ADM-ORD/ });

  await new Promise((resolve) => {
    if (server) {
      server.close(resolve);
    } else {
      resolve();
    }
  });

  await mongoose.disconnect();
  console.log('MongoDB disconnected & test server stopped.');

  console.log('\n====================================================');
  console.log(`ADMIN PART 1 TESTS: ${passedCount + failedCount}`);
  console.log(`PASSED: ${passedCount}`);
  console.log(`FAILED: ${failedCount}`);
  console.log('====================================================\n');

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
  } catch (err) {
    console.error('Fatal Admin Test Error:', err);
    failedCount++;
  } finally {
    await teardown();
  }
}

main();
