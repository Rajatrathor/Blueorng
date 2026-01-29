const prisma = require('../../config/db');
const razorpay = require('../../config/razorpay');
const { successResponse, errorResponse } = require('../../utils/response');
const sendEmail = require('../../utils/email');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const userName = req.user.name;
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      paymentMethod,
    } = req.body;

    // Get user cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return errorResponse(res, 'Cart is empty', 400);
    }

    // Calculate total
    let totalAmount = 0;
    for (const item of cart.items) {
      totalAmount += Number(item.product.price) * item.quantity;
    }

    // Create Order Transaction
    const order = await prisma.$transaction(async (prismaTx) => {
      // If online payment via Razorpay, create a Razorpay order first
      let razorpayOrderId = null;
      if (paymentMethod === 'RAZORPAY') {
        const rpOrder = await razorpay.orders.create({
          amount: Math.round(Number(totalAmount) * 100),
          currency: 'INR',
          receipt: `order_${userId}_${Date.now()}`,
        });
        razorpayOrderId = rpOrder.id;
      }

      // 1. Create Order
      const newOrder = await prismaTx.order.create({
        data: {
          userId,
          totalAmount,
          status: 'PENDING',
          paymentMethod,
          razorpayOrderId,
          fullName,
          phone,
          addressLine1,
          addressLine2,
          city,
          state,
          postalCode,
          country,
        },
      });

      // 2. Create Order Items and Update Stock
      for (const item of cart.items) {
        await prismaTx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            size: item.size,
          },
        });

        // Optional: Update stock
        // await prisma.product.update({
        //   where: { id: item.productId },
        //   data: { stock: { decrement: item.quantity } }
        // });
      }

      // 3. Clear Cart
      // Clear cart only for COD
      if (paymentMethod === 'COD') {
        await prismaTx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }

      return newOrder;
    });

    // If COD, send confirmation email and return success
    if (paymentMethod === 'COD') {
      const message = `
        <h1>Thank you for your order!</h1>
        <p>Hi ${userName},</p>
        <p>We have received your order #${order.id}.</p>
        <p>Total Amount: ₹${order.totalAmount}</p>
        <p>We will notify you once it's shipped.</p>
      `;
      try {
        await sendEmail({
          email: userEmail,
          subject: 'Order Confirmation',
          message: `Thank you for your order #${order.id}. Total: ₹${order.totalAmount}`,
          html: message
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
      return successResponse(res, order, 'Order created successfully', 201);
    }

    // For Razorpay, return payload to initiate payment on client
    if (order.razorpayOrderId) {
      return successResponse(res, {
        orderId: order.id,
        amount: order.totalAmount,
        currency: 'INR',
        razorpayOrderId: order.razorpayOrderId,
        keyId: process.env.RAZORPAY_KEY_ID,
      }, 'Razorpay order created', 201);
    }

    successResponse(res, order, 'Order created', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    successResponse(res, orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    successResponse(res, orders);
  } catch (error) {
    next(error);
  }
};


// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });
    successResponse(res, order, 'Order status updated');
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrders, updateOrderStatus };
