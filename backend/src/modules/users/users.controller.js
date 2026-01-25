const prisma = require('../../config/db');
const bcrypt = require('bcryptjs');
const { successResponse, errorResponse } = require('../../utils/response');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    successResponse(res, users);
  } catch (error) {
    next(error);
  }
};

// @desc    Create admin
// @route   POST /api/users/admin
// @access  Private/SuperAdmin
const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return errorResponse(res, 'User exists', 400);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    successResponse(res, { id: user.id, name: user.name, email: user.email, role: user.role }, 'Admin created', 201);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    successResponse(res, null, 'User deleted');
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/me
// @access  Private
const updateMe = async (req, res, next) => {
  try {
    const {
      name,
      email,
      shippingAddressLine1,
      shippingAddressLine2,
      shippingCity,
      shippingState,
      shippingPostalCode,
      shippingCountry,
      shippingPhone,
      billingAddressLine1,
      billingAddressLine2,
      billingCity,
      billingState,
      billingPostalCode,
      billingCountry,
    } = req.body;

    let data = {
      name,
      email,
      shippingAddressLine1,
      shippingAddressLine2,
      shippingCity,
      shippingState,
      shippingPostalCode,
      shippingCountry,
      shippingPhone,
      billingAddressLine1,
      billingAddressLine2,
      billingCity,
      billingState,
      billingPostalCode,
      billingCountry,
    };

    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

    if (email) {
      const exists = await prisma.user.findUnique({ where: { email } });
      if (exists && exists.id !== req.user.id) {
        return errorResponse(res, 'Email already in use', 400);
      }
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
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

    successResponse(res, user, 'Profile updated');
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, createAdmin, deleteUser, updateMe };
