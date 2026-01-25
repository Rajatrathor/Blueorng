const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { errorResponse } = require('../utils/response');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, role: true, name: true },
      });

      if (!req.user) {
        return errorResponse(res, 'Not authorized, user not found', 401);
      }

      next();
    } catch (error) {
      console.error(error);
      return errorResponse(res, 'Not authorized, token failed', 401);
    }
  }

  if (!token) {
    return errorResponse(res, 'Not authorized, no token', 401);
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN')) {
    next();
  } else {
    return errorResponse(res, 'Not authorized as admin', 403);
  }
};

const superAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'SUPER_ADMIN') {
    next();
  } else {
    return errorResponse(res, 'Not authorized as super admin', 403);
  }
};

module.exports = { protect, admin, superAdmin };
