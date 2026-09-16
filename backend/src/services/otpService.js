const mongoose = require('mongoose');
const { generateOTP, getOTPExpiry } = require('../utils/generateOTP');
const { sendOTPEmail } = require('./brevoService');
const Otp = require('../models/Otp');

// In-memory fallback map for environments without database or when running isolated tests
const memoryOtpStore = new Map();

const cleanMemoryStore = () => {
  const now = Date.now();
  for (const [key, record] of memoryOtpStore.entries()) {
    if (record.expiresAt.getTime() < now) {
      memoryOtpStore.delete(key);
    }
  }
};

/**
 * Generate and dispatch an OTP to a user's email via Brevo
 * @param {Object} options
 * @param {string} options.email - Recipient email
 * @param {string} [options.purpose='verification'] - Purpose of OTP
 * @param {string} [options.name=''] - Recipient name for email greeting
 * @param {number} [options.expiresInMinutes=10] - Validity window
 * @returns {Promise<{ success: boolean, message: string, expiresInMinutes: number, messageId?: string, isMock?: boolean }>}
 */
const generateAndSendOTP = async ({
  email,
  purpose = 'verification',
  name = '',
  expiresInMinutes = 10
}) => {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    throw new Error('Valid email address is required to generate OTP.');
  }

  const normalizedEmail = email.toLowerCase().trim();
  const otp = generateOTP(6);
  const expiresAt = getOTPExpiry(expiresInMinutes);

  // Store in Database if Mongoose is connected, else fallback to memory store
  const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

  if (isDbConnected) {
    // Invalidate any existing unused OTP for this email and purpose
    await Otp.updateMany(
      { email: normalizedEmail, purpose, isConsumed: false },
      { $set: { isConsumed: true } }
    );

    // Save newly minted OTP
    await Otp.create({
      email: normalizedEmail,
      otp,
      purpose,
      expiresAt,
      attempts: 0,
      isConsumed: false
    });
  } else {
    // Fallback in-memory storage
    cleanMemoryStore();
    const key = `${normalizedEmail}_${purpose}`;
    memoryOtpStore.set(key, {
      otp,
      expiresAt,
      attempts: 0,
      isConsumed: false
    });
  }

  // Dispatch email through Brevo
  const emailResult = await sendOTPEmail(normalizedEmail, otp, purpose, name, expiresInMinutes);

  return {
    success: true,
    message: `OTP sent successfully to ${normalizedEmail}`,
    expiresInMinutes,
    otp,
    messageId: emailResult.messageId,
    isMock: emailResult.isMock
  };
};

/**
 * Verify an OTP entered by the user
 * @param {Object} options
 * @param {string} options.email - Recipient email
 * @param {string} options.otp - OTP provided by the user
 * @param {string} [options.purpose='verification'] - Purpose to verify
 * @param {boolean} [options.consume=true] - Whether to mark OTP as consumed upon success
 * @returns {Promise<{ success: boolean, message: string }>}
 */
const verifyOTP = async ({
  email,
  otp,
  purpose = 'verification',
  consume = true
}) => {
  if (!email || !otp) {
    return { success: false, message: 'Email and OTP are required.' };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const trimmedOtp = otp.toString().trim();
  const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

  if (isDbConnected) {
    const record = await Otp.findOne({
      email: normalizedEmail,
      purpose,
      isConsumed: false
    }).sort({ createdAt: -1 });

    if (!record) {
      return { success: false, message: 'No active OTP found. Please request a new one.' };
    }

    if (new Date() > record.expiresAt) {
      record.isConsumed = true;
      await record.save();
      return { success: false, message: 'OTP has expired. Please request a new one.' };
    }

    if (record.attempts >= 5) {
      record.isConsumed = true;
      await record.save();
      return { success: false, message: 'Maximum verification attempts exceeded. Please request a new OTP.' };
    }

    if (record.otp !== trimmedOtp) {
      record.attempts += 1;
      await record.save();
      const remainingAttempts = Math.max(0, 5 - record.attempts);
      return {
        success: false,
        message: `Invalid OTP code. ${remainingAttempts} attempts remaining.`
      };
    }

    if (consume) {
      record.isConsumed = true;
      await record.save();
    }

    return { success: true, message: 'OTP verified successfully.' };
  } else {
    // In-memory verification fallback
    const key = `${normalizedEmail}_${purpose}`;
    const record = memoryOtpStore.get(key);

    if (!record || record.isConsumed) {
      return { success: false, message: 'No active OTP found. Please request a new one.' };
    }

    if (Date.now() > record.expiresAt.getTime()) {
      memoryOtpStore.delete(key);
      return { success: false, message: 'OTP has expired. Please request a new one.' };
    }

    if (record.attempts >= 5) {
      memoryOtpStore.delete(key);
      return { success: false, message: 'Maximum verification attempts exceeded. Please request a new OTP.' };
    }

    if (record.otp !== trimmedOtp) {
      record.attempts += 1;
      const remainingAttempts = Math.max(0, 5 - record.attempts);
      return {
        success: false,
        message: `Invalid OTP code. ${remainingAttempts} attempts remaining.`
      };
    }

    if (consume) {
      record.isConsumed = true;
      memoryOtpStore.delete(key);
    }

    return { success: true, message: 'OTP verified successfully.' };
  }
};

/**
 * Resend OTP with cooldown rate-limiting check
 * @param {Object} options
 * @param {string} options.email
 * @param {string} [options.purpose='verification']
 * @param {string} [options.name='']
 * @param {number} [options.cooldownSeconds=60]
 * @returns {Promise<Object>}
 */
const resendOTP = async ({
  email,
  purpose = 'verification',
  name = '',
  cooldownSeconds = 60
}) => {
  const normalizedEmail = email.toLowerCase().trim();
  const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

  if (isDbConnected) {
    const latestRecord = await Otp.findOne({
      email: normalizedEmail,
      purpose
    }).sort({ createdAt: -1 });

    if (latestRecord) {
      const elapsedSeconds = (Date.now() - new Date(latestRecord.createdAt).getTime()) / 1000;
      if (elapsedSeconds < cooldownSeconds) {
        const waitTime = Math.ceil(cooldownSeconds - elapsedSeconds);
        throw new Error(`Please wait ${waitTime} seconds before requesting a new OTP.`);
      }
    }
  }

  return await generateAndSendOTP({ email: normalizedEmail, purpose, name });
};

module.exports = {
  generateAndSendOTP,
  verifyOTP,
  resendOTP
};
