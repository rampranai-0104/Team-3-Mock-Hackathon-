const User = require('../models/User');
const Artist = require('../models/Artist');
const Institution = require('../models/Institution');
const otpService = require('../services/otpService');
const generateToken = require('../utils/generateToken');
const { hashPassword, comparePassword } = require('../utils/passwordHasher');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * POST /api/auth/send-otp
 * Dispatches an OTP to user's email via Brevo
 */
const sendOtp = async (req, res) => {
  try {
    const { email, purpose, name } = req.body;
    const result = await otpService.generateAndSendOTP({
      email,
      purpose: purpose || 'verification',
      name: name || ''
    });

    return sendSuccess(res, result.message, result, 200);
  } catch (error) {
    console.error('Error in sendOtp:', error);
    return sendError(res, error.message, null, 400);
  }
};

/**
 * POST /api/auth/verify-otp
 * Verifies entered OTP code
 */
const verifyOtp = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;
    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    const result = await otpService.verifyOTP({
      email: normalizedEmail,
      otp,
      purpose: purpose || 'verification'
    });

    if (!result.success) {
      return sendError(res, result.message, null, 400);
    }

    // If verified for registration or verification, mark user email as verified
    await User.findOneAndUpdate(
      { email: normalizedEmail },
      { emailVerified: true }
    );

    return sendSuccess(res, result.message, { verified: true, email: normalizedEmail }, 200);
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    return sendError(res, error.message, null, 500);
  }
};

/**
 * POST /api/auth/resend-otp
 * Resends OTP with rate-limiting check
 */
const resendOtp = async (req, res) => {
  try {
    const { email, purpose, name } = req.body;
    const result = await otpService.resendOTP({
      email,
      purpose: purpose || 'verification',
      name: name || ''
    });

    return sendSuccess(res, result.message, result, 200);
  } catch (error) {
    console.error('Error in resendOtp:', error);
    return sendError(res, error.message, null, 429);
  }
};

/**
 * POST /api/auth/register
 * User registration with optional OTP verification
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return sendError(res, 'User already exists with this email address.', null, 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      passwordHash: hashedPassword,
      phone: phone || '',
      role: role || 'public',
      status: 'active',
      isActive: true
    });

    // Auto-provision profile documents based on role
    if (user.role === 'artist') {
      try {
        await Artist.create({
          userId: user._id,
          displayName: user.name,
          bio: 'Preserving and practicing traditional tribal and folk heritage.',
          experience: 1,
          availability: true,
          verificationStatus: 'approved'
        });
      } catch (profileErr) {
        console.warn('Note: Could not auto-create Artist profile:', profileErr.message);
      }
    } else if (user.role === 'institution') {
      try {
        await Institution.create({
          userId: user._id,
          organizationName: user.name,
          type: 'school',
          contactPerson: { name: user.name, email: user.email, phone: user.phone },
          verificationStatus: 'verified'
        });
      } catch (instErr) {
        console.warn('Note: Could not auto-create Institution profile:', instErr.message);
      }
    }

    const token = generateToken(user._id, user.role);

    // Automatically send verification OTP to user's registered email
    let otpDispatched = false;
    try {
      await otpService.generateAndSendOTP({
        email: normalizedEmail,
        purpose: 'registration',
        name: user.name
      });
      otpDispatched = true;
    } catch (otpErr) {
      console.warn('Note: Could not send registration OTP:', otpErr.message);
    }

    return sendSuccess(res, 'User registered successfully. A verification OTP has been sent to your email.', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified
      },
      token,
      otpSent: otpDispatched
    }, 201);
  } catch (error) {
    console.error('Error in register:', error);
    return sendError(res, error.message, null, 500);
  }
};

/**
 * POST /api/auth/login
 * User login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select('+password +passwordHash');
    if (!user) {
      return sendError(res, 'Invalid email or password.', null, 401);
    }

    const isMatch = await comparePassword(password, user.password || user.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password.', null, 401);
    }

    const token = generateToken(user._id, user.role);

    return sendSuccess(res, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }, 200);
  } catch (error) {
    console.error('Error in login:', error);
    return sendError(res, error.message, null, 500);
  }
};

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 */
const getMe = async (req, res) => {
  try {
    return sendSuccess(res, 'Current user profile fetched successfully', {
      user: req.user
    }, 200);
  } catch (error) {
    console.error('Error in getMe:', error);
    return sendError(res, error.message, null, 500);
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  resendOtp,
  register,
  login,
  getMe
};
