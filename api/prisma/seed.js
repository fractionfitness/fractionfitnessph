const { PrismaClient } = require('@prisma/client');

const seedData = require('../data/seedData');

const prisma = new PrismaClient();

async function main() {
  // ... you will write your Prisma Client queries here

  // delete all records from all tables
  const deletePosts = prisma.post.deleteMany();
  const deleteProfile = prisma.profile.deleteMany();
  const deleteUsers = prisma.user.deleteMany();
  await prisma.$transaction([deleteProfile, deletePosts, deleteUsers]);

  // seed the db with data
  seedData.map(async (user) => {
    const dbRecords = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        posts: {
          create: user.posts,
        },
        profile: {
          create: user.profile,
        },
      },
      include: {
        posts: true,
        profile: true,
      },
    });
    return dbRecords;
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
