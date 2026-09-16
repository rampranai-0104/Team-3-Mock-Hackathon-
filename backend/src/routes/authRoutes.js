const express = require('express');
const router = express.Router();
const {
  sendOtp,
  verifyOtp,
  resendOtp,
  register,
  login,
  getMe
} = require('../controllers/authController');
const {
  validateSendOTP,
  validateVerifyOTP,
  validateRegister,
  validateLogin
} = require('../validators/authValidator');
const { protect } = require('../middleware/authMiddleware');

// OTP Endpoints
router.post('/send-otp', validateSendOTP, sendOtp);
router.post('/verify-otp', validateVerifyOTP, verifyOtp);
router.post('/resend-otp', validateSendOTP, resendOtp);

// Auth Endpoints
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);

module.exports = router;
