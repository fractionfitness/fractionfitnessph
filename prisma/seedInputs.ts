import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';
// import { hashSync } from 'bcrypt';
import { hash } from 'bcrypt';

import { generateRandomDateTimeString } from './seedUtils';

const p = path.join(
  path.dirname(require.main.filename),
  '..',
  'data',
  'seed.json',
);

// cannot import and use  the hashPassword from /lib/auth because it is a server-only module and ts-node thinks environment is client when executing this file
// only way to import it is to make ts-node think that this file (seedInputs.ts) is a commonjs module using cjs import/exports (module.exports = {}) instead of es6 import/export
async function hashPassword(password) {
  return await hash(password, 12);
}

/* TODOS: ////////////////////////////////////////////////////////////////////

- fix user, employee, and member roles since right now it is only assuming the default
- if randomly generating sessions, there must be no overlap of start_at for any two sessions on the same day
- define testing criteria - assign to pooch
- user profiles can be empty because some users will only have an email but seedInputData assumes users will always have a userProfile
- Model ids must be uuid
- it will be more difficult to generate fake data for a UserProfile if it is in a separate array from its corresponding User
- UserProfile and GroupProfile should automatically be created when a Group or User is created, just make their fields optional?

*/ ////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// INPUT THE FOLLOWING MODEL DATA SPECIFICS

// days of the week variables/shorthand
const [sun, mon, tue, wed, thu, fri, sat] = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

// input variable names and string values for sport/group types:

// input variable names and string values for sport/group types:
const [gym, jj, kb, tkd, yoga, gymnastics] = [
  'gym',
  'jiu jitsu',
  'kickboxing',
  'taekwondo',
  'yoga',
  'gymnastics',
];

// input number of users
const userArrLength = 20;

// input group data
const groupData = [
  // { name: 'overlimit jiu jitsu worldwide', type: jj },
  // { name: 'new ormoc-overlimit jiu jitsu academy', type: jj },
  // { name: 'overlimit jiu-jitsu tarlac academy', type: jj },
  // { name: 'iloilo combat types martial arts', type: jj },
  { name: 'fraction fitness', type: gym },
  { name: 'fraction jiu jitsu', type: jj },
  // { name: 'fraction kickboxing', type: kb },
  // { name: 'fraction taekwondo', type: tkd },
  // { name: 'fraction yoga', type: yoga },
  { name: 'fraction gymnastics', type: gymnastics },
  // { name: 'avengers taekwondo', type: tkd },
];

// input probability any group has a group profile
const groupProfileProbability = 1;

// input determined group relations | eventually add a function that will generate undetermined/random group relations
const groupRelationsData = [
  { parent: 'fraction fitness', child: 'fraction jiu jitsu' },
  { parent: 'fraction fitness', child: 'fraction gymnastics' },
];

const sessionData = {
  'fraction gymnastics': [
    {
      name: 'Gymnastics Sat',
      days: [sat],
      // Singapore Timezone (UTC +8) | Set correct timezones for the rest
      start_at: '1970-01-01T09:00:00.000+08:00',
      end_at: '1970-01-01T10:30:00.000+08:00',
    },
  ],
  // better to not separate fraction jj adults and teens into 2 groups since alot of their sessions have the same start_at values
  'fraction jiu jitsu': [
    {
      name: 'Adults Morning',
      days: [mon, tue, thu],
      start_at: '1970-01-01T09:30:00+08:00',
      end_at: '1970-01-01T11:00:00+08:00',
    },
    // using Minors instead of Kids and Teens for simplicity (Minors is applicable to both)
    {
      name: 'Adults & Minors Lvl 3 Weekday Afternoon',
      days: [mon, wed],
      start_at: '1970-01-01T17:30:00+08:00',
      end_at: '1970-01-01T18:30:00+08:00',
    },
    {
      name: 'Adults & Minors Lvl 3 Weekday Afternoon - No Gi',
      days: [fri],
      start_at: '1970-01-01T17:30:00+08:00',
      end_at: '1970-01-01T18:30:00+08:00',
    },
    {
      name: 'Adults Evening',
      days: [mon, tue, wed],
      start_at: '1970-01-01T19:30:00+08:00',
      end_at: '1970-01-01T21:30:00+08:00',
    },
    // group owner's choide whether to separate gi and no gi into different sessions
    {
      name: 'Adults Evening - No Gi',
      days: [thu],
      start_at: '1970-01-01T19:30:00+08:00',
      end_at: '1970-01-01T21:30:00+08:00',
    },
    {
      name: 'Adults & Minors Lvl 3 Evening',
      days: [fri],
      start_at: '1970-01-01T19:30:00+08:00',
      end_at: '1970-01-01T21:30:00+08:00',
    },
    {
      name: 'Adults Sat',
      days: [sat],
      start_at: '1970-01-01T14:30:00+08:00',
      end_at: '1970-01-01T16:30:00+08:00',
    },
    {
      name: 'Adults & Minors Level 1 & 2 Sun',
      days: [sun],
      start_at: '1970-01-01T16:30:00+08:00',
      end_at: '1970-01-01T18:00:00+08:00',
    },
    // either more general or more granular sessions but best to only have one unique group+session time period  to avoid confusion for members and employees, when checking in
    {
      name: 'Minors Lvl 1 Fri',
      days: [fri],
      start_at: '1970-01-01T16:30:00+08:00',
      end_at: '1970-01-01T17:30:00+08:00',
    },
    {
      name: 'Minors Lvl 1 Sat',
      days: [sat],
      start_at: '1970-01-01T13:00:00+08:00',
      end_at: '1970-01-01T14:30:00+08:00',
    },
    {
      name: 'Minors Lvl 3 Weekday',
      days: [mon, wed],
      start_at: '1970-01-01T17:30:00+08:00',
      end_at: '1970-01-01T18:30:00+08:00',
    },
    {
      name: 'Minors Lvl 2 & 3 Weekday - No Gi',
      days: [fri],
      start_at: '1970-01-01T17:30:00+08:00',
      end_at: '1970-01-01T18:30:00+08:00',
    },
    {
      name: 'Minors Lvl 2 & 3 Sat',
      days: [sat],
      start_at: '1970-01-01T14:30:00+08:00',
      end_at: '1970-01-01T16:30:00+08:00',
    },
    // even though teens lvl 2 & 3 sessions end at different times
    // (16:00 & 16:30, respectively), we don't monitor checkouts so it wont
    // matter in the end

    // {
    //   name: 'Minors Lvl 3 Sat',
    //   days: [sat],
    //   start_at: '1970-01-01T14:30:00+08:00',
    //   end_at: '1970-01-01T16:30:00+08:00',
    // },
  ],
};
//////////////////////////////////////////////////////////////////////////////

async function generateFakeModelDataArrays() {
  // sync hashing of password
  // const users = Array.from({ length: userArrLength }).map((_, index) => ({
  //   id: index + 1,
  //   email: faker.internet.email(),
  //   password: faker.helpers.maybe(
  //     () =>
  //       hashSync(faker.internet.password({ length: 5, memorable: true }), 12),
  //     { probability: 0.6 },
  //   ),
  // }));

  // async hashing of password
  // async-await doesn't work inside of Array.map() so use for-loop instead
  const users: Object[] = [];
  for (let i = 0; i < userArrLength; i++) {
    const generatedPword = faker.helpers.maybe(
      () =>
        faker.internet.password({
          length: 5,
          memorable: true,
        }),
      {
        probability: 0.6,
      },
    );

    const fakeUser = {
      id: i + 1,
      email: faker.internet.email(),
      unhashedPassword: generatedPword,
      password: generatedPword ? await hashPassword(generatedPword) : undefined,
      // alternative
      //   password: faker.helpers.maybe(() => true, { probability: 0.6 })
      //     ? await hashPassword(
      //         faker.internet.password({
      //           length: 5,
      //           memorable: true,
      //         }),
      //       )
      //     : undefined,
    };
    users.push(fakeUser);
  }

  //  longer version of above for-loop, but easier to read
  // for (let i = 0; i < userArrLength; i++) {
  //   let password = undefined;
  //   const hasPassword = faker.helpers.maybe(() => true, { probability: 0.6 });
  //   if (hasPassword) {
  //     const randomPword = faker.internet.password({
  //       length: 5,
  //       memorable: true,
  //     });
  //     password = await hashPassword(randomPword);
  //   }
  //   const fakeUser = {
  //     id: i + 1,
  //     email: faker.internet.email(),
  //     password: password,
  //   };
  //   users.push(fakeUser);
  // }

  // convert this to create userProfiles based on a random set of users that may/may not have profiles then connect their user_id
  const userProfiles = Array.from({ length: userArrLength }).map((_, index) => {
    const first_name = faker.person.firstName();
    const middle_name = faker.person.middleName();
    const last_name = faker.person.lastName();
    const suffix_name = faker.person.suffix();
    return {
      id: index + 1,
      user_id: index + 1,
      first_name,
      middle_name,
      last_name,
      suffix_name,
      full_name:
        `${first_name} ${middle_name} ${last_name} ${suffix_name}`.replace(
          /\s+/g,
          '',
        ),
    };
  });

  const groupsAndProfiles = groupData.map((group, index) => {
    const randomUser = faker.helpers.arrayElement(users);
    return {
      id: index + 1,
      name: group.name,
      // if no groupProfile, then create an obj with undefined values for the keys
      profile: faker.helpers.maybe(
        () => ({
          id: index + 1,
          type: group.type,
          country: 'Philippines',
        }),
        // change probability to less than 1.0 when testing for groups with no profiles
        { probability: 1.0 },
      ),
      // owner is automatically an employee so adjust employment seed data to push owner into array
      owner_id: randomUser.id,
    };
  });

  let idCount = 1;
  let sessions = [];
  // loop over sessionData object's keys (referencing each group name) to generate all session records
  // might be better to use Array.concat() instead of push, and use foreach instead of map
  for (let groupKey in sessionData) {
    const foundGroupObj = groupsAndProfiles.filter(
      (group) => group.name === groupKey,
    )[0];
    sessionData[groupKey].map(({ name, days, start_at, end_at }) => {
      // generate a session record for each day
      const sessionsPerDay = days.map((day) => ({
        id: idCount++,
        group_id: foundGroupObj.id,
        name,
        day,
        start_at,
        end_at,
        // assume status for any session is always active
      }));
      sessions.push(...sessionsPerDay);
    });
  }
  // reset idCount when finished looping over sessionData obj
  idCount = 1;

  const groupRelations = groupRelationsData.map((item) => ({
    parent_id: groupsAndProfiles.filter(
      (group) => group.name === item.parent,
    )[0].id,
    child_id: groupsAndProfiles.filter((group) => group.name === item.child)[0]
      .id,
  }));

  // users can be employees in different groups, not just 1
  let employees = [];
  groupsAndProfiles.map((group) => {
    // owner is always included first in employments[]
    employees.push({
      user_id: group.owner_id,
      group_id: group.id,
      role: 'OWNER',
    });

    // every group has the following probability of having at least 1 employee
    // if (faker.helpers.maybe(() => true, { probability: 1.0 })) {
    let dbRecords = [];
    // if (faker.helpers.maybe(() => true, { probability: 0.3 })) {
    //   let result = users.map((user) => {
    //     return {
    //       user_id: user.id,
    //       group_id: item.id,
    //     };
    //   });
    //   dbRecords.push(...result);
    // }

    // if a group has at least 1 employee, go through users and generate a user_id at the specified probability
    users.forEach((user) => {
      if (faker.helpers.maybe(() => true, { probability: 0.45 })) {
        const employee = {
          user_id: user.id,
          group_id: group.id,
        };
        dbRecords.push(employee);
      }
    });
    employees.push(...dbRecords);
    // }
  });
  idCount = 1;

  // users can be members in different groups, not just 1
  // might be better to use Array.concat() instead of push, and use foreach instead of map
  let members = [];
  groupsAndProfiles.map((item) => {
    // every group has the probability of having at least 1 member
    if (faker.helpers.maybe(() => true, { probability: 1.0 })) {
      // if a group has at least 1 member, go through users and generate a user_id at the specified probability
      let dbRecords = [];
      users.forEach((user) => {
        if (faker.helpers.maybe(() => true, { probability: 0.35 })) {
          const member = {
            // better to make Member pk (id) a composite of user_id and group_id, in the same manner as Employments?
            id: idCount++,
            user_id: user.id,
            group_id: item.id,
          };
          dbRecords.push(member);
        }
      });
      members.push(...dbRecords);
    }
  });
  idCount = 1;

  let memberCheckins = [];
  members.map((member) => {
    // get all of the current member's group sessions
    const availableSessionsForMember = sessions.filter(
      (session) => session.group_id === member.group_id,
    );

    // check if member's group has a session
    if (availableSessionsForMember.length > 0) {
      // for every member generate a random number of 0-10 which will be the loop counter to generate sessions
      const numberOfCheckins = faker.helpers.rangeToNumber({ min: 0, max: 10 });

      for (let i = 0; i < numberOfCheckins; i++) {
        // won't matter if selectedSessionId repeats since: (1) prisma will ensure duplicate records are not written to the db , and (2) datetimestamp should always be different every loop since a memberCheckin could be the same session but different datetimestamp
        const selectedSession = faker.helpers.arrayElement(
          availableSessionsForMember,
        );

        const memberCheckinRecord = {
          id: idCount++,
          session_id: selectedSession.id,
          member_id: member.id,
          // datetimestamp should be a random Date that must be the same day as the session, and checkin time is in between the session's start_at and end_at values
          datetimestamp: new Date(generateRandomDateTimeString()),
          date: new Date(generateRandomDateTimeString().slice(0, 10)),
        };

        memberCheckins.push(memberCheckinRecord);
      }
    }
  });

  return {
    users,
    userProfiles,
    groupsAndProfiles,
    sessions,
    groupRelations,
    employees,
    members,
    memberCheckins,
  };
}

// sync hashing of password
// fs.writeFileSync(p, JSON.stringify(generateFakeModelDataArrays()));

// async hashing of password
async function generateSeedData() {
  const data = JSON.stringify(await generateFakeModelDataArrays());
  fs.writeFile(p, data, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('seed generated successfully!');
    }
  });
}

generateSeedData();
