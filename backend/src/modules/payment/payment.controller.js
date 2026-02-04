const razorpay = require('../../config/razorpay');
const prisma = require('../../config/db');
const sendEmail = require('../../utils/email');
const crypto = require('crypto');
const { sendSMS } = require('../../utils/sms');

// CREATE ORDER

exports.verifyPayment = async (req, res, next) => {
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

        const found = await prisma.order.findUnique({
            where: { razorpayOrderId: razorpay_order_id },
            include: { user: true }
        });
        if (!found) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const order = await prisma.order.update({
            where: { id: found.id },
            data: {
                status: 'PAID',
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
            },
            include: { user: true }
        });

        const cart = await prisma.cart.findUnique({ where: { userId: order.userId } });
        if (cart) {
            await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
        console.log("📩 SMS TRIGGERED FOR:", order.phone);

        sendSMS({
            phone: order.phone,
            message: `Payment successful! Your order #${order.id} is confirmed. Thank you for shopping with BluOrng.`,
        }).catch(() => { });

        try {
            await sendEmail({
                email: order.user.email,
                subject: 'Payment Successful',
                message: `Order #${order.id} has been paid successfully. Total: ₹${order.totalAmount}`,
            });
        } catch (e) { }

        res.json({ success: true, orderId: order.id });
    } catch (err) {
        next(err);
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

