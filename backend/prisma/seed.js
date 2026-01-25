const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create Categories
  const tops = await prisma.category.upsert({
    where: { name: 'Tops' },
    update: {},
    create: { name: 'Tops' },
  });

  const bottoms = await prisma.category.upsert({
    where: { name: 'Bottoms' },
    update: {},
    create: { name: 'Bottoms' },
  });

  // Create Products
  const products = [
    {
      name: 'Oversized T-Shirt',
      description: 'Premium cotton oversized t-shirt in black.',
      price: 49.99,
      stock: 100,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'],
      categoryId: tops.id,
      color: 'Black',
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Cargo Pants',
      description: 'Functional cargo pants with multiple pockets.',
      price: 89.99,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'],
      categoryId: bottoms.id,
      color: 'Green',
      sizes: ['30', '32', '34', '36'],
    },
    {
      name: 'Graphic Hoodie',
      description: 'Heavyweight hoodie with signature print.',
      price: 79.99,
      stock: 80,
      images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2940&auto=format&fit=crop'],
      categoryId: tops.id,
      color: 'Grey',
      sizes: ['M', 'L', 'XL'],
    },
    {
      name: 'Denim Jacket',
      description: 'Classic denim jacket with a modern fit.',
      price: 120.00,
      stock: 30,
      images: ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=2787&auto=format&fit=crop'],
      categoryId: tops.id,
      color: 'Blue',
      sizes: ['S', 'M', 'L', 'XL'],
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  // Create Admin User
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('admin123', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password,
      role: 'ADMIN',
    },
  });

  // Create Super Admin User
  const superAdminPassword = await bcrypt.hash('superadmin123', salt);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: {
      email: 'superadmin@example.com',
      name: 'Super Admin User',
      password: superAdminPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
