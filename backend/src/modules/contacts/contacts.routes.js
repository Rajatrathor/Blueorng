const express = require('express');
const { createContactMessage, getContactMessages } = require('./contacts.controller');
const { protect, admin } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/', createContactMessage);
router.get('/', protect, admin, getContactMessages);

module.exports = router;
