const express = require('express');
const {
    createOrder,
    verifyPayment,
    razorpayWebhook,
} = require('./payment.controller');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);


module.exports = router;
