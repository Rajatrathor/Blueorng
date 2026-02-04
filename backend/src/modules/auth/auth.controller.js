const prisma = require('../../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { generateToken } = require('../../utils/jwt');
const { successResponse, errorResponse } = require('../../utils/response');
const sendEmail = require('../../utils/email');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!email || !password || !name) {
      return errorResponse(res, 'Please provide name, email and password', 400);
    }

    // Check if user exists by email OR mobile
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { mobile: mobile || undefined } // Only check mobile if provided
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return errorResponse(res, 'Email already registered', 400);
      }
      if (mobile && existingUser.mobile === mobile) {
        return errorResponse(res, 'Mobile number already registered', 400);
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        password: hashedPassword,
        // First user is SUPER_ADMIN for simplicity in this demo, or just USER. 
        // Let's stick to USER default.
      },
    });

    // Create a cart for the user
    await prisma.cart.create({
      data: {
        userId: user.id
      }
    });

    const token = generateToken(user.id, user.role);

    successResponse(res, {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      token,
    }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { identifier, password, otp } = req.body; // identifier can be email or mobile

    if (!identifier) {
      return errorResponse(res, 'Please provide email or mobile number', 400);
    }

    // Find user by email or mobile
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { mobile: identifier }
        ]
      }
    });

    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Login with OTP
    if (otp) {
      const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

      if (!user.otp || !user.otpExpires || user.otp !== hashedOtp || user.otpExpires < new Date()) {
        return errorResponse(res, 'Invalid or expired OTP', 401);
      }

      // Clear OTP after successful login
      await prisma.user.update({
        where: { id: user.id },
        data: { otp: null, otpExpires: null }
      });
    }
    // Login with Password
    else if (password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return errorResponse(res, 'Invalid credentials', 401);
      }
    } else {
      return errorResponse(res, 'Please provide password or OTP', 400);
    }

    const token = generateToken(user.id, user.role);

    return successResponse(res, {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      token,
    }, 'Login successful');

  } catch (error) {
    next(error);
  }
};

// @desc    Send OTP
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res, next) => {
  try {
    const { identifier } = req.body; // email or mobile

    if (!identifier) {
      return errorResponse(res, 'Please provide email or mobile number', 400);
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { mobile: identifier }
        ]
      }
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // Set expiry (10 minutes)
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: hashedOtp,
        otpExpires
      }
    });

    // Send OTP via Email (User said "otp will go to the register email")
    const message = `Your OTP for login/password reset is: ${otp}. It is valid for 10 minutes.`;

    // Send SMS if mobile is present
    if (user.mobile) {
      // Don't await strictly if you want parallel, or await to ensure delivery.
      // Usually SMS can be fire-and-forget or parallel.
      sendSMS({
        phone: user.mobile,
        message: `Your OTP is ${otp}. Valid for 10 min.`
      });
    }

    try {
      // Log OTP for development/demo purposes
      console.log(`DEV OTP for ${user.email}: ${otp}`);

      await sendEmail({
        email: user.email,
        subject: 'Your OTP Code',
        message,
      });

      successResponse(res, null, `OTP sent to ${user.email}`);
    } catch (error) {
      console.error('Email send error:', error);
      // We still return success if dev mode or just to not block flow, 
      // but in strict prod we might want to rollback.
      // For this task, let's assume if email fails, we tell user but since we logged it, it's fine for dev.
      // But let's return error to be safe.
      return errorResponse(res, 'Email could not be sent (check server logs for OTP)', 500);
    }

  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password via OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { identifier, otp, newPassword } = req.body;

    if (!identifier || !otp || !newPassword) {
      return errorResponse(res, 'Please provide all fields', 400);
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { mobile: identifier }
        ]
      }
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    if (!user.otp || !user.otpExpires || user.otp !== hashedOtp || user.otpExpires < new Date()) {
      return errorResponse(res, 'Invalid or expired OTP', 400);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpires: null
      }
    });

    successResponse(res, null, 'Password reset successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Change Password (Authenticated)
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return errorResponse(res, 'Please provide old and new password', 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return errorResponse(res, 'Incorrect old password', 401);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    successResponse(res, null, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        createdAt: true,
        shippingAddressLine1: true,
        shippingAddressLine2: true,
        shippingCity: true,
        shippingState: true,
        shippingPostalCode: true,
        shippingCountry: true,
        shippingPhone: true,
        billingAddressLine1: true,
        billingAddressLine2: true,
        billingCity: true,
        billingState: true,
        billingPostalCode: true,
        billingCountry: true,
      },
    });

    successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  sendOtp,
  resetPassword,
  changePassword
};
