const express = require('express');
const { getCategories, createCategory, deleteCategory } = require('./categories.controller');
const { protect, admin } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, admin, createCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
