const express = require('express');
const { getUsers, createAdmin, deleteUser, updateMe } = require('./users.controller');
const { protect, admin, superAdmin } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', admin, getUsers);
router.post('/admin', superAdmin, createAdmin);
router.delete('/:id', superAdmin, deleteUser);
router.put('/me', updateMe);

module.exports = router;
