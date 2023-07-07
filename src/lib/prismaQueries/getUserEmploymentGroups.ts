import prisma from '@/lib/prisma';

export default async function getUserEmploymentGroups(currentUser) {
  const user = await prisma.user.findFirst({
    where: {
      id: currentUser.id,
    },
    include: {
      employments: {
        include: {
          group: true,
        },
      },
    },
  });

  const employmentGroups = user?.employments.map((employment) => ({
    ...employment.group,
    role: employment.role,
  }));

  return employmentGroups;
}
