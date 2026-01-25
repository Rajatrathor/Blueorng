const express = require('express');
const { register, login, getMe, sendOtp, resetPassword, changePassword } = require('./auth.controller');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/reset-password', resetPassword);
router.put('/change-password', protect, changePassword);
router.get('/me', protect, getMe);

module.exports = router;
