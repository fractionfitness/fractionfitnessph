const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getUsers = async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany({
      include: {
        profile: true,
        posts: true,
      },
    });
    res.json(allUsers);
  } catch (e) {
    console.error(e);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id * 1; // converts string to number | most efficient
    const foundUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        posts: true,
      },
    });
    res.json(foundUser);
  } catch (e) {
    console.error(e);
  }
};
