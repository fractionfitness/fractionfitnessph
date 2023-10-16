import fs from 'fs';
import path from 'path';

//-----------------------------------------------------------------------------
// new prisma instantiation since /src/lib/prisma.ts is a server-only module
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
if (!global.cachedPrisma) {
  global.cachedPrisma = new PrismaClient();
}
prisma = global.cachedPrisma;
//-----------------------------------------------------------------------------

const p = path.join(
  path.dirname(require.main.filename),
  '..',
  'data',
  'seed.json',
);
const seed = JSON.parse(fs.readFileSync(p));
const {
  users,
  userProfiles,
  groupsAndProfiles,
  groupSessions,
  groupRelations,
  employees,
  members,
  memberCheckins,
} = seed;

async function main() {
  const deleteUsers = prisma.user.deleteMany();
  const deleteUserProfiles = prisma.userProfile.deleteMany();
  const deleteGroups = prisma.group.deleteMany();
  const deleteGroupProfiles = prisma.groupProfile.deleteMany();
  const deleteGroupSessions = prisma.groupSession.deleteMany();
  const deleteGroupRelations = prisma.groupRelation.deleteMany();
  const deleteEmployees = prisma.employee.deleteMany();
  const deleteEmployeeCheckins = prisma.employeeCheckin.deleteMany();
  const deleteMembers = prisma.member.deleteMany();
  const deleteMemberCheckins = prisma.memberCheckin.deleteMany();

  await prisma.$transaction([
    deleteEmployeeCheckins,
    deleteMemberCheckins,
    deleteEmployees,
    deleteMembers,
    deleteGroupRelations,
    deleteGroupSessions,
    deleteGroupProfiles,
    deleteGroups,
    deleteUserProfiles,
    deleteUsers,
  ]);

  const createUsersAndProfilesArray = users.map(({ id, email, password }) => {
    // find corresponding userProfile of user record
    const foundUserProfile = userProfiles.filter(
      (item) => item.user_id === id,
    )[0];
    const {
      id: profile_id,
      first_name,
      middle_name,
      last_name,
      suffix_name,
      full_name,
    } = foundUserProfile;

    return prisma.user.create({
      data: {
        id,
        email,
        password,
        profile: {
          create: {
            id: profile_id,
            first_name,
            middle_name,
            last_name,
            suffix_name,
            full_name,
          },
        },
      },
    });
  });

  const createGroupsAndProfilesArray = groupsAndProfiles.map((group, index) => {
    const { id: groupId, name, profile, owner_id } = group;
    if (group.profile) {
      const { id: profileId, country, type } = profile;
      return prisma.group.create({
        data: {
          id: groupId,
          name,
          profile: {
            create: {
              id: profileId,
              country,
              type,
            },
          },
          owner_id,
        },
      });
    } else {
      return prisma.group.create({
        data: {
          id: groupId,
          name,
          owner_id,
        },
      });
    }
  });

  const createGroupSessions = prisma.groupSession.createMany({
    data: groupSessions,
    skipDuplicates: true,
  });

  const createGroupRelations = prisma.groupRelation.createMany({
    data: groupRelations,
    skipDuplicates: true,
  });

  const createEmployees = prisma.employee.createMany({
    data: employees,
    skipDuplicates: true,
  });

  const createMembers = prisma.member.createMany({
    data: members,
    skipDuplicates: true,
  });

  const createMemberCheckins = prisma.memberCheckin.createMany({
    data: memberCheckins,
    skipDuplicates: true,
  });

  await prisma.$transaction([
    ...createUsersAndProfilesArray,
    ...createGroupsAndProfilesArray,
    createGroupSessions,
    createGroupRelations,
    createEmployees,
    createMembers,
    createMemberCheckins,
  ]);
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
