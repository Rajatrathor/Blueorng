const razorpay = require('../../config/razorpay');
const prisma = require('../../config/db');
const sendEmail = require('../../utils/email');
const crypto = require('crypto');

// CREATE ORDER
// exports.createOrder = async (req, res) => {
//     try {
//         const { amount } = req.body; // rupees

//         const order = await razorpay.orders.create({
//             amount: amount * 100, // paise
//             currency: 'INR',
//             receipt: `receipt_${Date.now()}`,
//         });

//         res.status(200).json(order);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Order creation failed' });
//     }
// };

exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const razorpayOrder = await razorpay.orders.create({
            amount: amount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        });

        // ✅ SAVE ORDER IN DB FIRST
        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                totalAmount: amount,
                status: 'PENDING',
                razorpayOrderId: razorpayOrder.id,
                keyId: process.env.RAZORPAY_KEY_ID,
            },
        });

        res.status(200).json({
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            orderId: order.id,

        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Order creation failed' });
    }
};


// VERIFY PAYMENT
// exports.verifyPayment = async (req, res, next) => {
//     const {
//         razorpay_order_id,
//         razorpay_payment_id,
//         razorpay_signature,
//     } = req.body;

//     const body = razorpay_order_id + '|' + razorpay_payment_id;

//     const expectedSignature = crypto
//         .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//         .update(body)
//         .digest('hex');

//     try {
//         if (expectedSignature === razorpay_signature) {
//             // Update order as PAID and persist payment details
//             const order = await prisma.order.update({
//                 where: { razorpayOrderId: razorpay_order_id },
//                 data: {
//                     status: 'PAID',
//                     razorpayPaymentId: razorpay_payment_id,
//                     razorpaySignature: razorpay_signature,
//                 },
//                 include: { user: true }
//             });
//             // Clear cart after successful payment
//             await prisma.cartItem.deleteMany({
//                 where: { cart: { userId: order.userId } }
//             });
//             // Send confirmation email
//             try {
//                 await sendEmail({
//                     email: order.user.email,
//                     subject: 'Payment Successful',
//                     message: `Order #${order.id} has been paid successfully. Total: ₹${order.totalAmount}`,
//                 });
//             } catch (e) { }
//             return res.json({ success: true, orderId: order.id });
//         } else {
//             // Mark order cancelled on verification failure
//             await prisma.order.update({
//                 where: { razorpayOrderId: razorpay_order_id },
//                 data: { status: 'CANCELLED' },
//             });
//             return res.status(400).json({ success: false });
//         }
//     } catch (err) {
//         next(err);
//     }

// };

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false });
        }

        // ✅ DO NOT update order here
        // Webhook will handle final status

        res.json({
            success: true,
            razorpay_order_id,
            razorpay_payment_id,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};

exports.razorpayWebhook = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const razorpaySignature = req.headers['x-razorpay-signature'];

        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(req.body)
            .digest('hex');

        if (expectedSignature !== razorpaySignature) {
            console.error('❌ Invalid Razorpay webhook signature');
            return res.status(400).json({ success: false });
        }

        const event = JSON.parse(req.body.toString());

        console.log('✅ Razorpay Webhook Event:', event.event);

        if (event.event === 'payment.captured') {
            const payment = event.payload.payment.entity;

            const order = await prisma.order.updateMany({
                where: {
                    razorpayOrderId: payment.order_id,
                    status: 'PENDING', // ✅ idempotent
                },
                data: {
                    status: 'PAID',
                    razorpayPaymentId: payment.id,
                },
            });

            console.log('✅ Order marked PAID');

            // Clear cart + send email only once
        }

        if (event.event === 'payment.failed') {
            const payment = event.payload.payment.entity;

            await prisma.order.updateMany({
                where: { razorpayOrderId: payment.order_id },
                data: { status: 'FAILED' },
            });

            console.log('❌ Order marked FAILED');
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Webhook error:', err);
        res.status(500).json({ success: false });
    }
};

// exports.razorpayWebhook = async (req, res) => {
//     const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

//     try {
//         const razorpaySignature = req.headers['x-razorpay-signature'];

//         // Verify signature
//         const expectedSignature = crypto
//             .createHmac('sha256', webhookSecret)
//             .update(req.body)
//             .digest('hex');

//         if (expectedSignature !== razorpaySignature) {
//             console.error('❌ Invalid Razorpay webhook signature');
//             return res.status(400).json({ success: false });
//         }

//         const event = JSON.parse(req.body.toString());

//         console.log('✅ Razorpay Webhook Event:', event.event);

//         // Handle payment captured
//         if (event.event === 'payment.captured') {
//             const payment = event.payload.payment.entity;

//             await prisma.order.updateMany({
//                 where: {
//                     razorpayOrderId: payment.order_id,
//                 },
//                 data: {
//                     status: 'PAID',
//                     razorpayPaymentId: payment.id,
//                 },
//             });

//             console.log('✅ Order marked as PAID via webhook');
//         }

//         // Handle payment failed
//         if (event.event === 'payment.failed') {
//             const payment = event.payload.payment.entity;

//             await prisma.order.updateMany({
//                 where: {
//                     razorpayOrderId: payment.order_id,
//                 },
//                 data: {
//                     status: 'FAILED',
//                 },
//             });

//             console.log('❌ Order marked as FAILED via webhook');
//         }

//         res.json({ success: true });
//     } catch (err) {
//         console.error('Webhook error:', err);
//         res.status(500).json({ success: false });
//     }
// };