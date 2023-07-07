import prisma from '@/lib/prisma';

export default async function getUserGroupSessions(currentUser) {
  const user = await prisma.user.findFirst({
    where: {
      id: currentUser.id,
    },
    include: {
      groups: {
        include: {
          sessions: true,
        },
      },
      memberships: {
        include: {
          group: {
            include: {
              sessions: true,
            },
          },
        },
      },
    },
  });

  const membershipGroups = user?.memberships.map((membership) => ({
    ...membership.group,
  }));

  const groupSessions = membershipGroups?.reduce((acc, group) => {
    acc.push(
      ...group.sessions.map((session) => ({
        group,
        session,
      })),
    );
    return acc;
  }, []);

  return groupSessions;
}
