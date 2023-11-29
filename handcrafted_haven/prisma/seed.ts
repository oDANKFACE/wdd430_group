import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput = {
  email: 'k@test.com',
  password: 'test',
  role: 'ADMIN',
  firstName: 'Kendra',
  lastName: 'Bryant',
};
const sellerData: Prisma.SellerProfileCreateInput = {
  bio: 'A yarn dyer.',
  user: {
    connect: {
      email: 'k@test.com',
    },
  },
};

async function main() {
  console.log(`Start seeding ...`);

  const user = await prisma.user.create({
    data: userData,
  });
  console.log(`Created user with id: ${user.id}`);

  const seller = await prisma.sellerProfile.create({
    data: {
      ...sellerData,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  const productData: Prisma.ProductCreateInput = {
    name: 'Knitted blanket',
    description: "The best blanket you'll ever own",
    price: 50,
    category: 'Handmade Item',
    seller: {
      connect: {
        id: seller.id,
      },
    },
  };

  const product = await prisma.product.create({
    data: productData,
  });
  console.log(`Created product with id: ${product.id}`);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
