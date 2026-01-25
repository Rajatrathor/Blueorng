const prisma = require('../../config/db');
const { successResponse, errorResponse } = require('../../utils/response');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { 
        items: {
          include: { product: true }
        } 
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
        include: { items: true }
      });
    }

    successResponse(res, cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, size } = req.body;

    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
      });
    }

    // Check if item already exists
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: parseInt(productId),
        size: size
      }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + parseInt(quantity) }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: parseInt(productId),
          quantity: parseInt(quantity),
          size
        }
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { 
        items: {
          include: { product: true }
        } 
      },
    });

    successResponse(res, updatedCart, 'Item added to cart');
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    
    if (quantity < 1) {
        // If quantity is 0 or less, maybe remove it? Or just error.
        // Let's assume remove if 0, or just error.
        return errorResponse(res, 'Quantity must be at least 1', 400);
    }

    await prisma.cartItem.update({
      where: { id: parseInt(req.params.itemId) },
      data: { quantity: parseInt(quantity) }
    });

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { 
        items: {
          include: { product: true }
        } 
      },
    });

    successResponse(res, cart, 'Cart updated');
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    await prisma.cartItem.delete({
      where: { id: parseInt(req.params.itemId) },
    });

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { 
        items: {
          include: { product: true }
        } 
      },
    });

    successResponse(res, cart, 'Item removed from cart');
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
