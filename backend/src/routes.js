const express = require('express');
const authRoutes = require('./modules/auth/auth.routes');
const productRoutes = require('./modules/products/products.routes');
const categoryRoutes = require('./modules/categories/categories.routes');
const cartRoutes = require('./modules/cart/cart.routes');
const orderRoutes = require('./modules/orders/orders.routes');
const userRoutes = require('./modules/users/users.routes');
const contactRoutes = require('./modules/contacts/contacts.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);
router.use('/contacts', contactRoutes);

module.exports = router;
