export const TIMEZONE_OFFSET = '+08:00'; // Singapore Timezone (UTC +8)
export const DAY_NAMES = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];
export const memberContent = {
  userType: 'Member',
  groupType: 'Membership',
  userRoles: ['COACH', 'MEMBER', 'VISITOR'],
  userStatus: [
    'ACTIVE',
    'INACTIVE',
    'BANNED',
    // 'SABBATICAL',
    // 'INJURED',
    // 'PAST DUE',
  ],
};
export const employeeContent = {
  userType: 'Employee',
  groupType: 'Employment',
  userRoles: ['OWNER', 'ADMIN', 'STAFF', 'VOLUNTEER'],
  userStatus: [
    'ACTIVE',
    'RESIGNED',
    'TERMINATED',
    // 'PROBATIONARY',
    // 'LOA',
    // 'AWOL',
    // 'END-OF-VOLUNTEER SERVICE',
  ],
};
