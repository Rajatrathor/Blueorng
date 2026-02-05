const prisma = require('../../config/db');
const { default: redis } = require('../../config/redis');
const { successResponse, errorResponse } = require('../../utils/response');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {

    const cachedProducts = await redis.get("products");

    if (cachedProducts) {
      console.log("CACHE HIT");
      return successResponse(
        res,
        JSON.parse(cachedProducts),
        "Products fetched",
        200,
        { source: "cache" }
      );
    }


    const { category, search, sort, active, minPrice, maxPrice, color, size, sizes, availability } = req.query;

    let where = {};

    if (category) {
      // Assuming category is passed as ID or Name. Let's assume ID for simplicity or join.
      // If name, we need to find category id first or do a relation filter.
      // Let's support categoryId query param directly for simplicity, or look up by name.
      // If query is ?category=Shirts, we look up category name.
      const categoryRecord = await prisma.category.findUnique({
        where: { name: category }
      });
      if (categoryRecord) {
        where.categoryId = categoryRecord.id;
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (typeof active !== 'undefined') {
      where.active = active === 'true';
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (color) {
      where.color = { equals: color, mode: 'insensitive' };
    }

    // Size filter: support 'size=M' or 'sizes=M,L'
    const sizeList = sizes ? String(sizes).split(',').map(s => s.trim()).filter(Boolean) : (size ? [String(size).trim()] : []);
    if (sizeList.length > 0) {
      where.sizes = { hasSome: sizeList };
    }

    if (availability) {
      if (availability === 'in_stock') {
        where.stock = { gt: 0 };
      } else if (availability === 'out_of_stock') {
        where.stock = { equals: 0 };
      }
    }

    let orderBy = {};
    if (sort === 'price_asc') orderBy.price = 'asc';
    if (sort === 'price_desc') orderBy.price = 'desc';
    if (sort === 'newest') orderBy.createdAt = 'desc';
    if (sort === 'featured') orderBy.createdAt = 'desc';

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: { category: true },
    });

    await redis.set("products", JSON.stringify(products), "EX", 60);


    successResponse(res, products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true },
    });

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    successResponse(res, product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, images, categoryId, color, sizes, active } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        images,
        categoryId: parseInt(categoryId),
        color,
        sizes,
        active: typeof active === 'boolean' ? active : true
      },
    });

    successResponse(res, product, 'Product created', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, images, categoryId, color, sizes, active } = req.body;

    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        description,
        price,
        stock,
        images,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        color,
        sizes,
        active
      },
    });

    successResponse(res, product, 'Product updated');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) },
    });

    successResponse(res, null, 'Product deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
