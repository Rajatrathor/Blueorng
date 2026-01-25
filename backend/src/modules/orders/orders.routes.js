const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} = require('./orders.controller');
const { protect, admin } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/myorders', getMyOrders);
router.get('/', admin, getOrders);
router.put('/:id', admin, updateOrderStatus);

module.exports = router;
