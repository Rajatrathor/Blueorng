const prisma = require('../../config/db');
const { successResponse, errorResponse } = require('../../utils/response');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    successResponse(res, categories);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({
      data: { name },
    });
    successResponse(res, category, 'Category created', 201);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.category.delete({ where: { id } });
    successResponse(res, null, 'Category deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, deleteCategory };
