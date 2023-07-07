import prisma from '@/lib/prisma';

export default async function getUserCheckins(currentUser) {
  const user = await prisma.user.findFirst({
    where: {
      id: currentUser.id,
    },
    include: {
      memberships: {
        include: {
          group: true,
          checkins: {
            include: {
              session: true,
            },
          },
        },
      },
    },
  });

  let membershipCheckins = user?.memberships.reduce((acc, membership) => {
    const { group, role, checkins } = membership;
    checkins.map((checkin) => {
      acc.push({ group, role, checkin });
    });
    return acc;
  }, []);

  return membershipCheckins;
}
