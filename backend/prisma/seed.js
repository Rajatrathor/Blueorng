const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {



  const password = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'rajatrathor554@gmail.com' },
    update: {},
    create: {
      email: 'rajatrathor554@gmail.com',
      name: 'Admin',
      password,
      role: 'ADMIN',
    },
  });

  console.log('✅ Seeding finished (categories + admin only)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
