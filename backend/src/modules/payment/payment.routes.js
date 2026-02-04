const express = require('express');
const {
    createOrder,
    verifyPayment,
    razorpayWebhook
} = require('./payment.controller');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Webhook must be unprotected as it is called by Razorpay
router.post('/webhook', razorpayWebhook);

router.use(protect);

router.post('/verify', verifyPayment);


module.exports = router;
