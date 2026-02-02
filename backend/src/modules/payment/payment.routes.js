const express = require('express');
const {
    createOrder,
    verifyPayment,
} = require('./payment.controller');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/verify', verifyPayment);


module.exports = router;
