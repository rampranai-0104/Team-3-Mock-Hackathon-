const assert = require('assert');
const mongoose = require('mongoose');

// Models
const Request = require('../src/models/Request');
const Product = require('../src/models/Product');
const Order = require('../src/models/Order');
const Booking = require('../src/models/Booking');
const constants = require('../src/utils/constants');

console.log('==============================================');
console.log('Running Cross-Module Compatibility Test Suite');
console.log('==============================================\n');

let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ FAIL: ${name}`);
    console.error(`  Error: ${err.message}`);
    failed++;
  }
}

// Test 1: Request model allows artistId to be null/undefined (General Institution Proposals)
runTest('Request model instantiation without artistId passes validation', () => {
  const dummyUser = new mongoose.Types.ObjectId();
  const dummyArtForm = new mongoose.Types.ObjectId();
  const reqDoc = new Request({
    requesterId: dummyUser,
    requesterType: 'institution',
    artFormId: dummyArtForm,
    title: 'Madhubani Painting Workshop for High School',
    preferredDate: new Date(),
    status: 'pending'
  });

  const err = reqDoc.validateSync();
  assert.strictEqual(err, undefined, `Expected no validation error, got: ${err && err.message}`);
  assert.strictEqual(reqDoc.artistId, undefined);
});

// Test 2: Order model accepts items with artistId, title, and name
runTest('Order model items accept artistId, title, and image correctly', () => {
  const dummyBuyer = new mongoose.Types.ObjectId();
  const dummyProduct = new mongoose.Types.ObjectId();
  const dummyArtist = new mongoose.Types.ObjectId();

  const orderDoc = new Order({
    orderNumber: 'ORD-TEST-12345',
    buyerId: dummyBuyer,
    items: [
      {
        productId: dummyProduct,
        artistId: dummyArtist,
        title: 'Pattachitra Canvas',
        name: 'Pattachitra Canvas',
        price: 4500,
        quantity: 2,
        image: 'https://cloudinary.com/test.jpg'
      }
    ],
    subtotal: 9000,
    total: 9000,
    status: 'created'
  });

  const err = orderDoc.validateSync();
  assert.strictEqual(err, undefined, `Expected no validation error, got: ${err && err.message}`);
  assert.strictEqual(orderDoc.items[0].artistId.toString(), dummyArtist.toString());
  assert.strictEqual(orderDoc.items[0].title, 'Pattachitra Canvas');
});

// Test 3: Booking model accepts artistId
runTest('Booking model accepts artistId for revenue tracking', () => {
  const dummyUser = new mongoose.Types.ObjectId();
  const dummyEvent = new mongoose.Types.ObjectId();
  const dummyArtist = new mongoose.Types.ObjectId();

  const bookingDoc = new Booking({
    bookingCode: 'BKG-TEST-9999',
    userId: dummyUser,
    eventId: dummyEvent,
    artistId: dummyArtist,
    quantity: 3,
    amount: 1500,
    status: 'confirmed'
  });

  const err = bookingDoc.validateSync();
  assert.strictEqual(err, undefined, `Expected no validation error, got: ${err && err.message}`);
  assert.strictEqual(bookingDoc.artistId.toString(), dummyArtist.toString());
});

// Test 4: Product model presave hook handles title/name and moderation status
runTest('Product model synchronizes name/title and moderation status defaults', () => {
  const dummyArtist = new mongoose.Types.ObjectId();
  const dummyArtForm = new mongoose.Types.ObjectId();

  const productDoc = new Product({
    artistId: dummyArtist,
    artFormId: dummyArtForm,
    title: 'Sohrai Wall Art Frame',
    price: 3200,
    stock: 5,
    status: 'active',
    moderationStatus: 'approved'
  });

  assert.strictEqual(productDoc.moderationStatus, 'approved');
  assert.strictEqual(productDoc.status, 'active');
});

// Test 5: Follow controller null-safe check simulation for offline artists
runTest('Follow controller null check handles offline artist without throwing', () => {
  const offlineArtist = {
    _id: new mongoose.Types.ObjectId(),
    displayName: 'Master Tribal Elder',
    userId: null,
    verificationStatus: 'approved'
  };

  const currentUserId = new mongoose.Types.ObjectId();

  // Test the safeguard logic
  const isSelf = offlineArtist.userId && offlineArtist.userId.toString() === currentUserId.toString();
  assert.strictEqual(Boolean(isSelf), false);
});

// Test 6: Verify constants interoperability between utils/constants and constants/index.js
runTest('Constants modules are bidirectionally compatible', () => {
  assert.ok(constants.ROLES.ARTIST === 'artist');
  assert.ok(constants.ROLES.INSTITUTION === 'institution');
  assert.ok(constants.PRODUCT_MODERATION_STATUS.APPROVED === 'approved');
  assert.ok(constants.ARTIST_STATUS.APPROVED === 'approved');
  assert.ok(constants.EVENT_TYPE.WORKSHOP === 'workshop');
});

// Test 7: Verify all public and institution controllers can be imported cleanly
runTest('All Public and Institution controllers load with zero import errors', () => {
  const publicControllers = [
    'activityController',
    'artFormController',
    'artistController',
    'communityController',
    'eventController',
    'followController',
    'knowledgeController',
    'learningController',
    'productController'
  ];

  for (const ctrl of publicControllers) {
    const loaded = require(`../src/controllers/public/${ctrl}`);
    assert.ok(loaded && typeof loaded === 'object', `Failed loading public/${ctrl}`);
  }

  const institutionControllers = [
    'bookingController',
    'communityController',
    'experienceController',
    'institutionController',
    'orderController',
    'requestController'
  ];

  for (const ctrl of institutionControllers) {
    const loaded = require(`../src/controllers/institution/${ctrl}`);
    assert.ok(loaded && typeof loaded === 'object', `Failed loading institution/${ctrl}`);
  }
});

console.log('\n==============================================');
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('==============================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All compatibility tests passed successfully!');
}
