const prisma = require('../../config/db');
const { successResponse, errorResponse } = require('../../utils/response');

const createContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return errorResponse(res, 'Please provide name, email, subject and message', 400);
    }
    const contact = await prisma.contactMessage.create({
      data: { name, email, phone, subject, message },
    });
    successResponse(res, contact, 'Message received', 201);
  } catch (error) {
    next(error);
  }
};

const getContactMessages = async (req, res, next) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    successResponse(res, messages);
  } catch (error) {
    next(error);
  }
};

module.exports = { createContactMessage, getContactMessages };
