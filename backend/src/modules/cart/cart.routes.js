const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require('./cart.controller');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:itemId', updateCartItem);
router.delete('/:itemId', removeFromCart);

module.exports = router;
