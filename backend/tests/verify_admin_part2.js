const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const User = require('../src/models/User');
const Artist = require('../src/models/Artist');
const ArtForm = require('../src/models/ArtForm');
const Event = require('../src/models/Event');
const Product = require('../src/models/Product');
const Request = require('../src/models/Request');
const Booking = require('../src/models/Booking');
const Order = require('../src/models/Order');
const Payment = require('../src/models/Payment');
const KnowledgeItem = require('../src/models/KnowledgeItem');
const {
  ROLES,
  PRODUCT_STATUS,
  PRODUCT_MODERATION_STATUS,
  REQUEST_STATUS,
  BOOKING_STATUS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  KNOWLEDGE_STATUS,
  KNOWLEDGE_TYPES
} = require('../src/constants');

const TEST_PORT = 5087;
const BASE_URL = `http://localhost:${TEST_PORT}`;
const JWT_SECRET = process.env.JWT_SECRET || 'tvarita_super_secret_jwt_key_2026_dev';

let server;
let testUsers = {};
let tokens = {};
let testArtForm;
let testArtist;
let testProduct;
let testRequest;
let testBooking;
let testOrder;
let testPayment;
let testKnowledge;

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
  console.log('\n--- Setting up Admin Part 2 Test Environment ---');
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tvarita';
  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB.');

  // Clean test documents
  await User.deleteMany({ email: /@test-admin-part2\.local$/ });
  await Artist.deleteMany({ displayName: /Admin Part 2 Artist/ });
  await ArtForm.deleteMany({ slug: /admin-part2-art-form/ });
  await Product.deleteMany({ title: /Admin Part 2 Product/ });
  await Request.deleteMany({ message: /Admin Part 2 Request/ });
  await Booking.deleteMany({ bookingCode: /ADM2-BK/ });
  await Order.deleteMany({ orderNumber: /ADM2-ORD/ });
  await KnowledgeItem.deleteMany({ title: /Admin Part 2 Knowledge/ });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  // 1. Admin user
  testUsers.admin = await User.create({
    name: 'Admin Part2 Manager',
    email: 'admin@test-admin-part2.local',
    passwordHash,
    role: ROLES.ADMIN
  });
  tokens.admin = generateToken(testUsers.admin);

  // 2. Artist user & profile
  testUsers.artist = await User.create({
    name: 'Madhubani Master',
    email: 'artist@test-admin-part2.local',
    passwordHash,
    role: ROLES.ARTIST
  });
  tokens.artist = generateToken(testUsers.artist);

  testArtForm = await ArtForm.create({
    name: 'Madhubani Painting',
    slug: 'madhubani-painting-admin-part2-art-form',
    description: 'Traditional Mithila art form'
  });

  testArtist = await Artist.create({
    userId: testUsers.artist._id,
    displayName: 'Admin Part 2 Artist Sita Devi',
    bio: 'Renowned Madhubani painter',
    artFormIds: [testArtForm._id],
    location: { city: 'Madhubani', state: 'Bihar', country: 'India' }
  });

  // 3. Public user
  testUsers.public = await User.create({
    name: 'Public Buyer',
    email: 'public@test-admin-part2.local',
    passwordHash,
    role: ROLES.PUBLIC
  });
  tokens.public = generateToken(testUsers.public);

  // 4. Institution user
  testUsers.institution = await User.create({
    name: 'National Museum',
    email: 'museum@test-admin-part2.local',
    passwordHash,
    role: ROLES.INSTITUTION
  });
  tokens.institution = generateToken(testUsers.institution);

  // Seed Product
  testProduct = await Product.create({
    artistId: testArtist._id,
    artFormId: testArtForm._id,
    title: 'Admin Part 2 Product Kohbar Painting',
    description: 'Traditional wedding chamber motif',
    price: 4500,
    stock: 3,
    status: PRODUCT_STATUS.DRAFT,
    moderationStatus: PRODUCT_MODERATION_STATUS.PENDING_REVIEW
  });

  // Seed Request
  testRequest = await Request.create({
    requesterId: testUsers.institution._id,
    requesterType: 'institution',
    artistId: testArtist._id,
    artFormId: testArtForm._id,
    eventType: 'workshop',
    groupSize: 30,
    preferredDate: new Date(Date.now() + 86400000 * 14),
    message: 'Admin Part 2 Request: Museum master workshop inquiry',
    status: REQUEST_STATUS.PENDING
  });

  // Seed Event
  const seedEvent = await Event.create({
    title: 'Admin Part 2 Event Mithila Workshop',
    type: 'workshop',
    artistIds: [testArtist._id],
    createdBy: testUsers.admin._id,
    artFormIds: [testArtForm._id],
    dateTime: new Date(Date.now() + 86400000 * 7),
    capacity: 25,
    price: 800,
    status: 'published'
  });

  // Seed Payment & Booking
  testPayment = await Payment.create({
    provider: 'razorpay',
    providerOrderId: 'order_test_part2_001',
    providerPaymentId: 'pay_test_part2_001',
    amount: 800,
    status: PAYMENT_STATUS.CAPTURED
  });

  testBooking = await Booking.create({
    bookingCode: 'ADM2-BK-001',
    userId: testUsers.public._id,
    eventId: seedEvent._id,
    artistId: testArtist._id,
    quantity: 1,
    amount: 800,
    status: BOOKING_STATUS.CONFIRMED,
    paymentId: testPayment._id
  });

  // Seed Order
  testOrder = await Order.create({
    orderNumber: 'ADM2-ORD-001',
    buyerId: testUsers.public._id,
    items: [
      {
        productId: testProduct._id,
        artistId: testArtist._id,
        title: testProduct.title,
        quantity: 1,
        price: testProduct.price
      }
    ],
    subtotal: 4500,
    total: 4500,
    status: ORDER_STATUS.PAID,
    paymentId: testPayment._id
  });

  // Seed Knowledge Item
  testKnowledge = await KnowledgeItem.create({
    title: 'Admin Part 2 Knowledge History of Mithila Lineage',
    type: KNOWLEDGE_TYPES.HISTORY,
    artFormId: testArtForm._id,
    artistIds: [testArtist._id],
    content: 'Mithila painting dates back to the Ramayana period.',
    summary: 'A brief history of traditional Madhubani motifs.',
    status: KNOWLEDGE_STATUS.DRAFT,
    createdBy: testUsers.admin._id
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
  console.log('STARTING TESTS: ADMIN BACKEND — PART 2');
  console.log('====================================================\n');

  // =========================================================
  // 1. AUTHENTICATION & AUTHORIZATION
  // =========================================================
  console.log('--- 1. AUTHENTICATION & AUTHORIZATION ---');

  // 1.1 Unauthenticated request rejected
  const unauthRes = await fetch(`${BASE_URL}/api/admin/products`);
  assertTest('Unauthenticated access to /api/admin/products returns 401', unauthRes.status === 401);

  // 1.2 Non-admin roles rejected (403)
  const pubRes = await fetch(`${BASE_URL}/api/admin/products`, {
    headers: { Authorization: `Bearer ${tokens.public}` }
  });
  assertTest('Public role user rejected from /api/admin/products (403)', pubRes.status === 403);

  const instRes = await fetch(`${BASE_URL}/api/admin/requests`, {
    headers: { Authorization: `Bearer ${tokens.institution}` }
  });
  assertTest('Institution role user rejected from /api/admin/requests (403)', instRes.status === 403);

  const artistRes = await fetch(`${BASE_URL}/api/admin/bookings`, {
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  assertTest('Artist role user rejected from /api/admin/bookings (403)', artistRes.status === 403);

  // 1.3 Admin role accepted (200)
  const adminRes = await fetch(`${BASE_URL}/api/admin/products`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  assertTest('Admin role user accepted on /api/admin/products (200)', adminRes.status === 200);

  // =========================================================
  // 2. ADMIN PRODUCTS
  // =========================================================
  console.log('\n--- 2. ADMIN PRODUCTS ---');

  // 2.1 GET /api/admin/products
  const getProdsRes = await fetch(`${BASE_URL}/api/admin/products?moderationStatus=pending_review`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const getProdsData = await getProdsRes.json();
  assertTest('GET /api/admin/products with filter returns 200', getProdsRes.status === 200);
  assertTest('Returns seeded pending review product', getProdsData.data?.products?.some(p => p._id === testProduct._id.toString()));
  assertTest('Pagination metadata present', Boolean(getProdsData.data?.page && getProdsData.data?.totalPages));

  // 2.2 PATCH /api/admin/products/:id (Approve product)
  const approveProdRes = await fetch(`${BASE_URL}/api/admin/products/${testProduct._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({
      moderationStatus: 'approved',
      status: 'active'
    })
  });
  const approveProdData = await approveProdRes.json();
  assertTest('Admin approving product returns 200 OK', approveProdRes.status === 200);
  assertTest('Product moderationStatus is updated to "approved"', approveProdData.data?.moderationStatus === 'approved');
  assertTest('Product status is active', approveProdData.data?.status === 'active');

  // 2.3 Invalid moderation status rejected
  const invalidModRes = await fetch(`${BASE_URL}/api/admin/products/${testProduct._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ moderationStatus: 'non_existent_status' })
  });
  assertTest('Invalid moderation status rejected with 400', invalidModRes.status === 400);

  // 2.4 Invalid product ID rejected
  const invalidProdIdRes = await fetch(`${BASE_URL}/api/admin/products/invalid-id-format`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ status: 'active' })
  });
  assertTest('Invalid product ID format rejected with 400', invalidProdIdRes.status === 400);

  // 2.5 Nonexistent product handled
  const randomProdId = new mongoose.Types.ObjectId();
  const nonExistentProdRes = await fetch(`${BASE_URL}/api/admin/products/${randomProdId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ status: 'active' })
  });
  assertTest('Nonexistent product returns 404 Not Found', nonExistentProdRes.status === 404);

  // 2.6 DELETE /api/admin/products/:id (Referenced in testOrder -> archive instead of hard delete)
  const deleteRefProdRes = await fetch(`${BASE_URL}/api/admin/products/${testProduct._id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const deleteRefProdData = await deleteRefProdRes.json();
  assertTest('Deleting product referenced by order archives it (status: archived)', 
    deleteRefProdData.data?.status === 'archived'
  );

  // =========================================================
  // 3. ADMIN REQUESTS
  // =========================================================
  console.log('\n--- 3. ADMIN REQUESTS ---');

  // 3.1 GET /api/admin/requests
  const getReqsRes = await fetch(`${BASE_URL}/api/admin/requests?status=pending`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const getReqsData = await getReqsRes.json();
  assertTest('GET /api/admin/requests returns 200', getReqsRes.status === 200);
  assertTest('Lists requests with requester information', getReqsData.data?.requests?.some(r => r._id === testRequest._id.toString()));

  // 3.2 PATCH /api/admin/requests/:id (Valid status transition)
  const updateReqRes = await fetch(`${BASE_URL}/api/admin/requests/${testRequest._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ status: 'accepted' })
  });
  const updateReqData = await updateReqRes.json();
  assertTest('Updating request status returns 200 OK', updateReqRes.status === 200);
  assertTest('Request status is now "accepted"', updateReqData.data?.status === 'accepted');

  // 3.3 Invalid status rejected
  const invalidReqStatusRes = await fetch(`${BASE_URL}/api/admin/requests/${testRequest._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ status: 'unknown_status' })
  });
  assertTest('Invalid request status rejected with 400', invalidReqStatusRes.status === 400);

  // 3.4 Nonexistent request handled
  const nonExistentReqRes = await fetch(`${BASE_URL}/api/admin/requests/${new mongoose.Types.ObjectId()}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ status: 'completed' })
  });
  assertTest('Nonexistent request returns 404', nonExistentReqRes.status === 404);

  // =========================================================
  // 4. ADMIN BOOKINGS
  // =========================================================
  console.log('\n--- 4. ADMIN BOOKINGS ---');

  // 4.1 GET /api/admin/bookings
  const getBookingsRes = await fetch(`${BASE_URL}/api/admin/bookings?status=confirmed`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const getBookingsData = await getBookingsRes.json();
  assertTest('GET /api/admin/bookings returns 200', getBookingsRes.status === 200);
  assertTest('Lists confirmed bookings', getBookingsData.data?.bookings?.some(b => b._id === testBooking._id.toString()));
  assertTest('Exposes related event and payment details', Boolean(getBookingsData.data?.bookings[0]?.eventId?.title));

  // 4.2 PATCH /api/admin/bookings/:id (Refunded workflow)
  const refundBookingRes = await fetch(`${BASE_URL}/api/admin/bookings/${testBooking._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ status: 'refunded' })
  });
  const refundBookingData = await refundBookingRes.json();
  assertTest('Updating booking to "refunded" returns 200 OK', refundBookingRes.status === 200);
  assertTest('Booking status is "refunded"', refundBookingData.data?.status === 'refunded');

  // Verify associated Payment status was synchronized to 'refunded'
  const updatedPayment = await Payment.findById(testPayment._id);
  assertTest('Associated Payment status synchronized to "refunded"', updatedPayment.status === 'refunded');

  // 4.3 Invalid booking status rejected
  const invalidBkStatusRes = await fetch(`${BASE_URL}/api/admin/bookings/${testBooking._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ status: 'bad_status' })
  });
  assertTest('Invalid booking status rejected with 400', invalidBkStatusRes.status === 400);

  // 4.4 Nonexistent booking returns 404
  const nonExistentBkRes = await fetch(`${BASE_URL}/api/admin/bookings/${new mongoose.Types.ObjectId()}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ status: 'completed' })
  });
  assertTest('Nonexistent booking returns 404', nonExistentBkRes.status === 404);

  // =========================================================
  // 5. ADMIN ORDERS
  // =========================================================
  console.log('\n--- 5. ADMIN ORDERS ---');

  // 5.1 GET /api/admin/orders
  const getOrdersRes = await fetch(`${BASE_URL}/api/admin/orders?status=paid`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const getOrdersData = await getOrdersRes.json();
  assertTest('GET /api/admin/orders returns 200', getOrdersRes.status === 200);
  assertTest('Lists paid orders', getOrdersData.data?.orders?.some(o => o._id === testOrder._id.toString()));

  // 5.2 PATCH /api/admin/orders/:id (Fulfillment transition: paid -> processing)
  const processOrderRes = await fetch(`${BASE_URL}/api/admin/orders/${testOrder._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ status: 'processing' })
  });
  const processOrderData = await processOrderRes.json();
  assertTest('Updating order status to "processing" returns 200 OK', processOrderRes.status === 200);
  assertTest('Order status is "processing"', processOrderData.data?.status === 'processing');

  // 5.3 Verify item price snapshot remains stable
  const checkedOrder = await Order.findById(testOrder._id);
  assertTest('Historical item price snapshot remains intact (4500)', checkedOrder.items[0]?.price === 4500);

  // 5.4 Invalid order status rejected
  const invalidOrdStatusRes = await fetch(`${BASE_URL}/api/admin/orders/${testOrder._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ status: 'non_existent_order_status' })
  });
  assertTest('Invalid order status rejected with 400', invalidOrdStatusRes.status === 400);

  // 5.5 Nonexistent order returns 404
  const nonExistentOrdRes = await fetch(`${BASE_URL}/api/admin/orders/${new mongoose.Types.ObjectId()}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ status: 'shipped' })
  });
  assertTest('Nonexistent order returns 404', nonExistentOrdRes.status === 404);

  // =========================================================
  // 6. ADMIN KNOWLEDGE
  // =========================================================
  console.log('\n--- 6. ADMIN KNOWLEDGE ---');

  // 6.1 GET /api/admin/knowledge
  const getKnowRes = await fetch(`${BASE_URL}/api/admin/knowledge`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const getKnowData = await getKnowRes.json();
  assertTest('GET /api/admin/knowledge returns 200', getKnowRes.status === 200);
  assertTest('Lists knowledge items', getKnowData.data?.items?.some(k => k._id === testKnowledge._id.toString()));

  // 6.2 POST /api/admin/knowledge
  const createKnowRes = await fetch(`${BASE_URL}/api/admin/knowledge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({
      title: 'Admin Part 2 Knowledge Ritualistic Colors',
      type: 'material',
      artFormId: testArtForm._id,
      content: 'Natural dyes extracted from lampblack, ochre, and leaves.',
      summary: 'Materials used in authentic ritual paintings.',
      status: 'review'
    })
  });
  const createKnowData = await createKnowRes.json();
  assertTest('POST /api/admin/knowledge creates new entry (201)', createKnowRes.status === 201);
  assertTest('Knowledge status is "review"', createKnowData.data?.status === 'review');
  const createdKnowledgeId = createKnowData.data?._id;

  // 6.3 PATCH /api/admin/knowledge/:id (Publish)
  const publishKnowRes = await fetch(`${BASE_URL}/api/admin/knowledge/${createdKnowledgeId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ status: 'published' })
  });
  const publishKnowData = await publishKnowRes.json();
  assertTest('PATCH /api/admin/knowledge/:id publishes entry (200)', publishKnowRes.status === 200);
  assertTest('Knowledge status is now "published"', publishKnowData.data?.status === 'published');

  // 6.4 POST /api/admin/knowledge/:id/media (Upload media)
  const knowMediaForm = new FormData();
  const dummyImg = new Blob([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], { type: 'image/png' });
  knowMediaForm.append('media', dummyImg, 'pigment.png');
  knowMediaForm.append('title', 'Natural Pigments');

  const uploadKnowMediaRes = await fetch(`${BASE_URL}/api/admin/knowledge/${createdKnowledgeId}/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokens.admin}` },
    body: knowMediaForm
  });
  const uploadKnowMediaData = await uploadKnowMediaRes.json();
  assertTest('POST /api/admin/knowledge/:id/media uploads archival media (201)', uploadKnowMediaRes.status === 201);
  assertTest('Uploaded media has URL and publicId', Boolean(uploadKnowMediaData.data?.url && uploadKnowMediaData.data?.publicId));

  // 6.5 DELETE /api/admin/knowledge/:id (Published item -> archived)
  const deletePubKnowRes = await fetch(`${BASE_URL}/api/admin/knowledge/${createdKnowledgeId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  const deletePubKnowData = await deletePubKnowRes.json();
  assertTest('Deleting published knowledge archives it (status: archived)', 
    deletePubKnowData.data?.status === 'archived'
  );

  // 6.6 Nonexistent knowledge returns 404
  const nonExistentKnowRes = await fetch(`${BASE_URL}/api/admin/knowledge/${new mongoose.Types.ObjectId()}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.admin}`
    },
    body: JSON.stringify({ status: 'review' })
  });
  assertTest('Nonexistent knowledge item returns 404', nonExistentKnowRes.status === 404);

  // =========================================================
  // 7. REGRESSION SANITY CHECKS
  // =========================================================
  console.log('\n--- 7. REGRESSION SANITY CHECKS ---');

  // 7.1 Admin Part 1 sanity check: GET /api/admin/dashboard
  const dashSanityRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${tokens.admin}` }
  });
  assertTest('Admin Part 1 sanity check: GET /api/admin/dashboard returns 200', dashSanityRes.status === 200);

  // 7.2 Artist Module sanity check: GET /api/artists/me
  const artistSanityRes = await fetch(`${BASE_URL}/api/artists/me`, {
    headers: { Authorization: `Bearer ${tokens.artist}` }
  });
  assertTest('Artist module sanity check: GET /api/artists/me returns 200', artistSanityRes.status === 200);
}

async function teardown() {
  console.log('\n--- Cleaning up Admin Part 2 Test Data ---');
  await User.deleteMany({ email: /@test-admin-part2\.local$/ });
  await Artist.deleteMany({ displayName: /Admin Part 2 Artist/ });
  await ArtForm.deleteMany({ slug: /admin-part2-art-form/ });
  await Product.deleteMany({ title: /Admin Part 2 Product/ });
  await Request.deleteMany({ message: /Admin Part 2 Request/ });
  await Booking.deleteMany({ bookingCode: /ADM2-BK/ });
  await Order.deleteMany({ orderNumber: /ADM2-ORD/ });
  await KnowledgeItem.deleteMany({ title: /Admin Part 2 Knowledge/ });

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
  console.log(`ADMIN PART 2 TESTS: ${passedCount + failedCount}`);
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
    console.error('Fatal Admin Part 2 Test Error:', err);
    failedCount++;
  } finally {
    await teardown();
  }
}

main();
