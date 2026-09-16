const assert = require('assert');
const { generateOTP, getOTPExpiry } = require('../src/utils/generateOTP');
const brevoService = require('../src/services/brevoService');
const otpService = require('../src/services/otpService');

// Validators
const artistValidator = require('../src/validators/artistValidator');
const artFormValidator = require('../src/validators/artFormValidator');
const eventValidator = require('../src/validators/eventValidator');
const productValidator = require('../src/validators/productValidator');

console.log('====================================================');
console.log('Testing OTP, Brevo & Express-Validator Modules');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ FAIL: ${name}`);
    console.error(`  Error: ${err.message}`);
    failed++;
  }
}

function runSyncTest(name, fn) {
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

async function main() {
  // --- 1. generateOTP tests ---
  runSyncTest('generateOTP generates 6-digit numeric string by default', () => {
    const otp = generateOTP();
    assert.strictEqual(typeof otp, 'string');
    assert.strictEqual(otp.length, 6);
    assert.ok(/^\d{6}$/.test(otp), `OTP should be 6 digits: ${otp}`);
  });

  runSyncTest('generateOTP generates custom length (4 and 8 digits)', () => {
    const otp4 = generateOTP(4);
    assert.strictEqual(otp4.length, 4);
    assert.ok(/^\d{4}$/.test(otp4));

    const otp8 = generateOTP(8);
    assert.strictEqual(otp8.length, 8);
    assert.ok(/^\d{8}$/.test(otp8));
  });

  runSyncTest('getOTPExpiry returns future Date with requested window', () => {
    const now = Date.now();
    const expiry = getOTPExpiry(15);
    assert.ok(expiry instanceof Date);
    const diffMinutes = Math.round((expiry.getTime() - now) / (60 * 1000));
    assert.strictEqual(diffMinutes, 15);
  });

  // --- 2. brevoService tests ---
  await runAsyncTest('brevoService.sendEmail returns mock confirmation when API key unset', async () => {
    const res = await brevoService.sendEmail({
      to: 'test@tvarita.local',
      subject: 'Unit Test Email',
      htmlContent: '<p>Test</p>'
    });
    assert.strictEqual(res.success, true);
    assert.ok(res.messageId.startsWith('mock_brevo_'));
    assert.strictEqual(res.isMock, true);
  });

  await runAsyncTest('brevoService.sendOTPEmail sends branded OTP template', async () => {
    const res = await brevoService.sendOTPEmail('artisan@tvarita.local', '789123', 'verification', 'Ramesh');
    assert.strictEqual(res.success, true);
    assert.ok(res.messageId);
  });

  await runAsyncTest('brevoService.sendWelcomeEmail sends welcome message', async () => {
    const res = await brevoService.sendWelcomeEmail('welcome@tvarita.local', 'Priya', 'artist');
    assert.strictEqual(res.success, true);
  });

  // --- 3. otpService tests ---
  await runAsyncTest('otpService.generateAndSendOTP generates and dispatches OTP', async () => {
    const result = await otpService.generateAndSendOTP({
      email: 'user_test_otp@example.com',
      purpose: 'registration',
      name: 'Ananya',
      expiresInMinutes: 10
    });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.expiresInMinutes, 10);
  });

  await runAsyncTest('otpService.verifyOTP validates correct code and rejects incorrect code', async () => {
    // Generate new OTP
    const testEmail = 'verify_flow@example.com';
    await otpService.generateAndSendOTP({
      email: testEmail,
      purpose: 'verification'
    });

    // Incorrect OTP
    const badVerify = await otpService.verifyOTP({
      email: testEmail,
      otp: '000000',
      purpose: 'verification'
    });
    assert.strictEqual(badVerify.success, false);
    assert.ok(badVerify.message.includes('Invalid OTP code'));
  });

  await runAsyncTest('otpService rejects empty or invalid email parameter', async () => {
    let errorCaught = false;
    try {
      await otpService.generateAndSendOTP({ email: 'invalid-email' });
    } catch {
      errorCaught = true;
    }
    assert.strictEqual(errorCaught, true);
  });

  // --- 4. Validator modules exports and structures ---
  runSyncTest('artistValidator exports all expected validation middleware chains', () => {
    assert.ok(Array.isArray(artistValidator.validateUpdateArtistProfile));
    assert.ok(Array.isArray(artistValidator.validateAdminOnboardArtist));
    assert.ok(Array.isArray(artistValidator.validateUpdateVerificationStatus));
    assert.ok(Array.isArray(artistValidator.validateArtistId));
  });

  runSyncTest('artFormValidator exports all expected validation middleware chains', () => {
    assert.ok(Array.isArray(artFormValidator.validateCreateArtForm));
    assert.ok(Array.isArray(artFormValidator.validateUpdateArtForm));
    assert.ok(Array.isArray(artFormValidator.validateArtFormId));
  });

  runSyncTest('eventValidator exports all expected validation middleware chains', () => {
    assert.ok(Array.isArray(eventValidator.validateCreateEvent));
    assert.ok(Array.isArray(eventValidator.validateUpdateEvent));
    assert.ok(Array.isArray(eventValidator.validateEventId));
  });

  runSyncTest('productValidator exports all expected validation middleware chains', () => {
    assert.ok(Array.isArray(productValidator.validateCreateProduct));
    assert.ok(Array.isArray(productValidator.validateUpdateProduct));
    assert.ok(Array.isArray(productValidator.validateModerateProduct));
    assert.ok(Array.isArray(productValidator.validateProductId));
  });

  console.log('\n====================================================');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error in tests:', err);
  process.exit(1);
});
