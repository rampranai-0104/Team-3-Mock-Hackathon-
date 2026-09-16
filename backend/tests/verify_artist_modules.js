const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const User = require('../src/models/User');
const Artist = require('../src/models/Artist');
const ArtForm = require('../src/models/ArtForm');
const Request = require('../src/models/Request');
const Event = require('../src/models/Event');
const Product = require('../src/models/Product');
const Booking = require('../src/models/Booking');
const Order = require('../src/models/Order');
const Follow = require('../src/models/Follow');
const {
  ROLES,
  ARTIST_VERIFICATION_STATUS,
  REQUEST_STATUS,
  EVENT_STATUS,
  PRODUCT_STATUS,
  PRODUCT_MODERATION_STATUS,
  BOOKING_STATUS,
  ORDER_STATUS
} = require('../src/constants');

const TEST_PORT = 5085;
const BASE_URL = `http://localhost:${TEST_PORT}`;
const JWT_SECRET = process.env.JWT_SECRET || 'tvarita_super_secret_jwt_key_2026_dev';

let server;
let testUsers = {};
let tokens = {};
let mainArtist;
let otherArtist;
let seededArtForm;

// Test counters
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
  console.log('\n--- Setting up Comprehensive Test Environment ---');
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tvarita';
  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB.');

  // Clean test database records
  await User.deleteMany({ email: /@test-complete-artist\.local$/ });
  await Artist.deleteMany({ displayName: /Main Test Artist|Other Test Artist/ });
  await ArtForm.deleteMany({ slug: /complete-artist-art-form/ });
  await Request.deleteMany({ message: /Test Request/ });
  await Event.deleteMany({ title: /Test Event/ });
  await Product.deleteMany({ title: /Test Product/ });
  await Booking.deleteMany({ bookingCode: /TEST-BK/ });
  await Order.deleteMany({ orderNumber: /TEST-ORD/ });

  // Create ArtForm
  seededArtForm = await ArtForm.create({
    name: 'Pithora Tribal Art',
    slug: 'pithora-tribal-art-complete-artist-art-form',
    description: 'Ritualistic folk painting of Gujarat and Madhya Pradesh'
  });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  // 1. Main Artist User & Profile
  testUsers.artist = await User.create({
    name: 'Paresh Rathwa',
    email: 'paresh@test-complete-artist.local',
    passwordHash,
    role: ROLES.ARTIST
  });
  tokens.artist = generateToken(testUsers.artist);

  mainArtist = await Artist.create({
    userId: testUsers.artist._id,
    displayName: 'Main Test Artist Paresh',
    bio: 'Pithora master artist',
    artFormIds: [seededArtForm._id],
    location: { city: 'Chhota Udaipur', state: 'Gujarat', country: 'India' },
    languages: ['Gujarati', 'Hindi'],
    experience: 20,
    verificationStatus: ARTIST_VERIFICATION_STATUS.APPROVED
  });

  // 2. Secondary Artist User & Profile (for isolation tests)
  testUsers.otherArtist = await User.create({
    name: 'Shanti Bai',
    email: 'shanti@test-complete-artist.local',
    passwordHash,
    role: ROLES.ARTIST
  });
  tokens.otherArtist = generateToken(testUsers.otherArtist);

  otherArtist = await Artist.create({
    userId: testUsers.otherArtist._id,
    displayName: 'Other Test Artist Shanti',
    bio: 'Bhil painter',
    location: { city: 'Jhabua', state: 'Madhya Pradesh', country: 'India' }
  });

  // 3. Public User
  testUsers.public = await User.create({
    name: 'Rohan Sharma',
    email: 'rohan@test-complete-artist.local',
    passwordHash,
    role: ROLES.PUBLIC
  });
  tokens.public = generateToken(testUsers.public);

  // 4. Institution User
  testUsers.institution = await User.create({
    name: 'St. Xavier School',
    email: 'xavier@test-complete-artist.local',
    passwordHash,
    role: ROLES.INSTITUTION
  });
  tokens.institution = generateToken(testUsers.institution);

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
  console.log('STARTING TESTS: COMPLETE ARTIST BACKEND MODULE');
  console.log('====================================================\n');

  // =========================================================
  // MODULE 1: ARTIST PROFILE
  // =========================================================
  console.log('--- MODULE 1: ARTIST PROFILE ---');

  // 1.1 GET /api/artists/me
  const getProfileRes = await fetch(`${BASE_URL}/api/artists/me`, {
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  const getProfileData = await getProfileRes.json();
  assertTest('GET /api/artists/me returns 200 for authenticated artist', getProfileRes.status === 200);
  assertTest('Profile contains expected displayName', getProfileData.data?.displayName === 'Main Test Artist Paresh');

  // 1.2 PATCH /api/artists/me
  const patchProfileRes = await fetch(`${BASE_URL}/api/artists/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.artist}`
    },
    body: JSON.stringify({
      bio: 'Updated master bio with national award.'
    })
  });
  const patchProfileData = await patchProfileRes.json();
  assertTest('PATCH /api/artists/me updates bio', patchProfileData.data?.bio === 'Updated master bio with national award.');

  // 1.3 POST /api/artists/me/media
  const mediaForm = new FormData();
  const dummyImg = new Blob([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], { type: 'image/png' });
  mediaForm.append('media', dummyImg, 'art.png');
  mediaForm.append('title', 'Pithora Horses');

  const uploadMediaRes = await fetch(`${BASE_URL}/api/artists/me/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokens.artist}` },
    body: mediaForm
  });
  const uploadMediaData = await uploadMediaRes.json();
  assertTest('POST /api/artists/me/media returns 201 Created', uploadMediaRes.status === 201);
  const uploadedMediaId = uploadMediaData.data?._id;

  // 1.4 DELETE /api/artists/me/media/:mediaId
  const deleteMediaRes = await fetch(`${BASE_URL}/api/artists/me/media/${uploadedMediaId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  assertTest('DELETE /api/artists/me/media/:mediaId returns 200 OK', deleteMediaRes.status === 200);

  // =========================================================
  // MODULE 2: ARTIST REQUESTS
  // =========================================================
  console.log('\n--- MODULE 2: ARTIST REQUESTS ---');

  // Seed two requests: one for mainArtist, one for otherArtist
  const mainRequest = await Request.create({
    requesterId: testUsers.institution._id,
    requesterType: 'institution',
    artistId: mainArtist._id,
    artFormId: seededArtForm._id,
    eventType: 'workshop',
    groupSize: 40,
    preferredDate: new Date(Date.now() + 86400000 * 7),
    message: 'Test Request: Please conduct school workshop',
    budget: 15000,
    status: REQUEST_STATUS.PENDING
  });

  const otherRequest = await Request.create({
    requesterId: testUsers.public._id,
    requesterType: 'public',
    artistId: otherArtist._id,
    preferredDate: new Date(Date.now() + 86400000 * 5),
    message: 'Test Request for other artist',
    status: REQUEST_STATUS.PENDING
  });

  // 2.1 GET /api/artists/me/requests
  const getRequestsRes = await fetch(`${BASE_URL}/api/artists/me/requests`, {
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  const getRequestsData = await getRequestsRes.json();
  assertTest('GET /api/artists/me/requests returns 200 OK', getRequestsRes.status === 200);
  assertTest('Returns requests assigned to this artist', getRequestsData.data?.length === 1 && getRequestsData.data[0]._id === mainRequest._id.toString());

  // 2.2 GET /api/artists/me/requests/:id
  const getSingleReqRes = await fetch(`${BASE_URL}/api/artists/me/requests/${mainRequest._id}`, {
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  const getSingleReqData = await getSingleReqRes.json();
  assertTest('GET /api/artists/me/requests/:id returns 200 OK', getSingleReqRes.status === 200);
  assertTest('Request contains populated requester info', Boolean(getSingleReqData.data?.requesterId?.name));

  // 2.3 Isolation: Cannot access another artist's request
  const isolationReqRes = await fetch(`${BASE_URL}/api/artists/me/requests/${otherRequest._id}`, {
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  assertTest('Accessing another artist\'s request returns 404', isolationReqRes.status === 404);

  // 2.4 PATCH /api/artists/me/requests/:id (Valid transition: pending -> accepted)
  const acceptReqRes = await fetch(`${BASE_URL}/api/artists/me/requests/${mainRequest._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.artist}`
    },
    body: JSON.stringify({ status: REQUEST_STATUS.ACCEPTED })
  });
  const acceptReqData = await acceptReqRes.json();
  assertTest('Accepting request returns 200 OK', acceptReqRes.status === 200);
  assertTest('Request status is now "accepted"', acceptReqData.data?.status === 'accepted');

  // 2.5 Invalid transition (accepted -> rejected is forbidden)
  const invalidTransRes = await fetch(`${BASE_URL}/api/artists/me/requests/${mainRequest._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.artist}`
    },
    body: JSON.stringify({ status: REQUEST_STATUS.REJECTED })
  });
  assertTest('Invalid status transition is rejected with 400', invalidTransRes.status === 400);

  // =========================================================
  // MODULE 3: ARTIST EVENTS
  // =========================================================
  console.log('\n--- MODULE 3: ARTIST EVENTS ---');

  // 3.1 POST /api/artists/me/events (Direct publishing forbidden)
  const directPublishRes = await fetch(`${BASE_URL}/api/artists/me/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.artist}`
    },
    body: JSON.stringify({
      title: 'Test Event: Pithora Masterclass',
      dateTime: new Date(Date.now() + 86400000 * 10),
      capacity: 25,
      price: 500,
      status: 'published'
    })
  });
  assertTest('Direct event publishing by artist is rejected with 400', directPublishRes.status === 400);

  // 3.2 POST /api/artists/me/events (Valid draft/proposal)
  const createEventRes = await fetch(`${BASE_URL}/api/artists/me/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.artist}`
    },
    body: JSON.stringify({
      title: 'Test Event: Pithora Masterclass',
      type: 'masterclass',
      artFormIds: [seededArtForm._id],
      description: 'Learn sacred pithora motifs',
      dateTime: new Date(Date.now() + 86400000 * 10),
      capacity: 25,
      price: 500,
      status: 'pending_approval'
    })
  });
  const createEventData = await createEventRes.json();
  assertTest('POST /api/artists/me/events creates event (201)', createEventRes.status === 201);
  assertTest('Event status is "pending_approval"', createEventData.data?.status === 'pending_approval');
  const createdEventId = createEventData.data?._id;

  // 3.3 GET /api/artists/me/events
  const getEventsRes = await fetch(`${BASE_URL}/api/artists/me/events`, {
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  const getEventsData = await getEventsRes.json();
  assertTest('GET /api/artists/me/events returns 200', getEventsRes.status === 200);
  assertTest('List includes the created event', getEventsData.data?.some(e => e._id === createdEventId));

  // 3.4 PATCH /api/artists/me/events/:id (Tamper check: bookedCount)
  const tamperBookedRes = await fetch(`${BASE_URL}/api/artists/me/events/${createdEventId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.artist}`
    },
    body: JSON.stringify({ bookedCount: 15 })
  });
  assertTest('Tampering with bookedCount is rejected with 400', tamperBookedRes.status === 400);

  // 3.5 Valid PATCH /api/artists/me/events/:id
  const updateEventRes = await fetch(`${BASE_URL}/api/artists/me/events/${createdEventId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.artist}`
    },
    body: JSON.stringify({ capacity: 30 })
  });
  const updateEventData = await updateEventRes.json();
  assertTest('Updating event returns 200 OK', updateEventRes.status === 200);
  assertTest('Capacity updated to 30', updateEventData.data?.capacity === 30);

  // =========================================================
  // MODULE 4: ARTIST EARNINGS
  // =========================================================
  console.log('\n--- MODULE 4: ARTIST EARNINGS ---');

  // Seed Booking earnings for mainArtist
  await Booking.create({
    bookingCode: 'TEST-BK-001',
    userId: testUsers.public._id,
    eventId: createdEventId,
    artistId: mainArtist._id,
    quantity: 2,
    amount: 1000,
    status: BOOKING_STATUS.CONFIRMED
  });

  // Seed Product and Order earnings for mainArtist
  const testProductForOrder = await Product.create({
    artistId: mainArtist._id,
    artFormId: seededArtForm._id,
    title: 'Test Product Painted Canvas',
    price: 3500,
    stock: 5,
    status: PRODUCT_STATUS.ACTIVE,
    moderationStatus: PRODUCT_MODERATION_STATUS.APPROVED
  });

  await Order.create({
    orderNumber: 'TEST-ORD-001',
    buyerId: testUsers.public._id,
    items: [
      {
        productId: testProductForOrder._id,
        artistId: mainArtist._id,
        title: 'Test Product Painted Canvas',
        quantity: 1,
        price: 3500
      }
    ],
    subtotal: 3500,
    total: 3500,
    status: ORDER_STATUS.PAID
  });

  // 4.1 GET /api/artists/me/earnings
  const getEarningsRes = await fetch(`${BASE_URL}/api/artists/me/earnings`, {
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  const getEarningsData = await getEarningsRes.json();
  assertTest('GET /api/artists/me/earnings returns 200 OK', getEarningsRes.status === 200);
  assertTest('Booking paid earnings calculated (1000)', getEarningsData.data?.breakdown?.bookings?.paid === 1000);
  assertTest('Product paid earnings calculated (3500)', getEarningsData.data?.breakdown?.products?.paid === 3500);
  assertTest('Total earnings matches sum (4500)', getEarningsData.data?.totalEarnings === 4500);
  assertTest('Transactions history contains records', getEarningsData.data?.transactions?.length >= 2);

  // =========================================================
  // MODULE 5: ARTIST FOLLOWERS
  // =========================================================
  console.log('\n--- MODULE 5: ARTIST FOLLOWERS ---');

  // Seed Follow relationships
  await Follow.create({
    userId: testUsers.public._id,
    artistId: mainArtist._id
  });
  await Follow.create({
    userId: testUsers.institution._id,
    artistId: mainArtist._id
  });

  // 5.1 GET /api/artists/me/followers
  const getFollowersRes = await fetch(`${BASE_URL}/api/artists/me/followers`, {
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  const getFollowersData = await getFollowersRes.json();
  assertTest('GET /api/artists/me/followers returns 200 OK', getFollowersRes.status === 200);
  assertTest('Follower count is 2', getFollowersData.data?.followerCount === 2);
  assertTest('Followers list has 2 entries', getFollowersData.data?.followers?.length === 2);
  assertTest('Sensitive fields (passwordHash, email) NOT exposed', 
    getFollowersData.data?.followers?.every(f => !f.user.passwordHash && !f.user.email)
  );

  // =========================================================
  // MODULE 6: ARTIST PRODUCTS
  // =========================================================
  console.log('\n--- MODULE 6: ARTIST PRODUCTS ---');

  // 6.1 POST /api/artists/me/products (Self-approval rejected)
  const selfApproveRes = await fetch(`${BASE_URL}/api/artists/me/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.artist}`
    },
    body: JSON.stringify({
      title: 'Test Product Self Approved',
      price: 1200,
      stock: 3,
      artFormId: seededArtForm._id,
      moderationStatus: 'approved'
    })
  });
  assertTest('Direct self-approval of product is rejected (400)', selfApproveRes.status === 400);

  // 6.2 POST /api/artists/me/products (Valid product creation)
  const createProductRes = await fetch(`${BASE_URL}/api/artists/me/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.artist}`
    },
    body: JSON.stringify({
      title: 'Test Product Sacred Wall Hanging',
      description: 'Handwoven cloth with authentic Pithora horse motifs',
      price: 2400,
      stock: 4,
      artFormId: seededArtForm._id,
      moderationStatus: 'pending_review'
    })
  });
  const createProductData = await createProductRes.json();
  assertTest('POST /api/artists/me/products creates product (201)', createProductRes.status === 201);
  assertTest('Product moderationStatus is "pending_review"', createProductData.data?.moderationStatus === 'pending_review');
  const createdProductId = createProductData.data?._id;

  // 6.3 GET /api/artists/me/products
  const getProductsRes = await fetch(`${BASE_URL}/api/artists/me/products`, {
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  const getProductsData = await getProductsRes.json();
  assertTest('GET /api/artists/me/products returns 200 OK', getProductsRes.status === 200);
  assertTest('List includes the created product', getProductsData.data?.some(p => p._id === createdProductId));

  // 6.4 GET /api/artists/me/products/:id
  const getSingleProdRes = await fetch(`${BASE_URL}/api/artists/me/products/${createdProductId}`, {
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  const getSingleProdData = await getSingleProdRes.json();
  assertTest('GET /api/artists/me/products/:id returns 200 OK', getSingleProdRes.status === 200);
  assertTest('Product title matches', getSingleProdData.data?.title === 'Test Product Sacred Wall Hanging');

  // 6.5 Isolation: Cannot access other artist's product
  const otherProduct = await Product.create({
    artistId: otherArtist._id,
    artFormId: seededArtForm._id,
    title: 'Other Artist Product',
    price: 900,
    stock: 2
  });
  const otherProdRes = await fetch(`${BASE_URL}/api/artists/me/products/${otherProduct._id}`, {
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  assertTest('Accessing another artist\'s product returns 404', otherProdRes.status === 404);

  // 6.6 PATCH /api/artists/me/products/:id
  const updateProdRes = await fetch(`${BASE_URL}/api/artists/me/products/${createdProductId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.artist}`
    },
    body: JSON.stringify({ price: 2800, stock: 6 })
  });
  const updateProdData = await updateProdRes.json();
  assertTest('PATCH /api/artists/me/products/:id updates price and stock', 
    updateProdData.data?.price === 2800 && updateProdData.data?.stock === 6
  );

  // 6.7 POST /api/artists/me/products/:id/media
  const prodMediaForm = new FormData();
  const prodImg = new Blob([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], { type: 'image/png' });
  prodMediaForm.append('media', prodImg, 'product.png');

  const uploadProdMediaRes = await fetch(`${BASE_URL}/api/artists/me/products/${createdProductId}/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokens.artist}` },
    body: prodMediaForm
  });
  const uploadProdMediaData = await uploadProdMediaRes.json();
  assertTest('POST /api/artists/me/products/:id/media uploads product image (201)', uploadProdMediaRes.status === 201);
  assertTest('Media has URL and publicId', Boolean(uploadProdMediaData.data?.url));

  // 6.8 DELETE /api/artists/me/products/:id (Draft deletion)
  const deleteProdRes = await fetch(`${BASE_URL}/api/artists/me/products/${createdProductId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  assertTest('DELETE /api/artists/me/products/:id returns 200 OK', deleteProdRes.status === 200);

  // =========================================================
  // MODULE 7: ROLE & AUTHENTICATION ENFORCEMENT
  // =========================================================
  console.log('\n--- ROLE & AUTHENTICATION ENFORCEMENT ---');
  
  // Public user accessing requests
  const pubReqRes = await fetch(`${BASE_URL}/api/artists/me/requests`, {
    headers: { Authorization: `Bearer ${tokens.public}` }
  });
  assertTest('Public user rejected from requests (403)', pubReqRes.status === 403);

  // Public user accessing events
  const pubEventRes = await fetch(`${BASE_URL}/api/artists/me/events`, {
    headers: { Authorization: `Bearer ${tokens.public}` }
  });
  assertTest('Public user rejected from events (403)', pubEventRes.status === 403);

  // Public user accessing earnings
  const pubEarnRes = await fetch(`${BASE_URL}/api/artists/me/earnings`, {
    headers: { Authorization: `Bearer ${tokens.public}` }
  });
  assertTest('Public user rejected from earnings (403)', pubEarnRes.status === 403);

  // Public user accessing followers
  const pubFollRes = await fetch(`${BASE_URL}/api/artists/me/followers`, {
    headers: { Authorization: `Bearer ${tokens.public}` }
  });
  assertTest('Public user rejected from followers (403)', pubFollRes.status === 403);

  // Public user accessing products
  const pubProdRes = await fetch(`${BASE_URL}/api/artists/me/products`, {
    headers: { Authorization: `Bearer ${tokens.public}` }
  });
  assertTest('Public user rejected from products (403)', pubProdRes.status === 403);

  // Institution user accessing products
  const instProdRes = await fetch(`${BASE_URL}/api/artists/me/products`, {
    headers: { Authorization: `Bearer ${tokens.institution}` }
  });
  assertTest('Institution user rejected from products (403)', instProdRes.status === 403);
}

async function teardown() {
  console.log('\n--- Cleaning up Test Data ---');
  await User.deleteMany({ email: /@test-complete-artist\.local$/ });
  await Artist.deleteMany({ displayName: /Main Test Artist|Other Test Artist/ });
  await ArtForm.deleteMany({ slug: /complete-artist-art-form/ });
  await Request.deleteMany({ message: /Test Request/ });
  await Event.deleteMany({ title: /Test Event/ });
  await Product.deleteMany({ title: /Test Product/ });
  await Booking.deleteMany({ bookingCode: /TEST-BK/ });
  await Order.deleteMany({ orderNumber: /TEST-ORD/ });

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
  console.log(`COMPLETE ARTIST MODULE TESTS: ${passedCount + failedCount}`);
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
    console.error('Fatal Test Error:', err);
    failedCount++;
  } finally {
    await teardown();
  }
}

main();
