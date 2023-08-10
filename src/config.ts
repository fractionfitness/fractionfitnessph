// fixes => ReferenceError: Cannot access 'padLeftWithOneZero' before initialization
// cannot import padLeftWithOneZero from @/lib/utils since config.ts is loaded first
const padLeftWithOneZero = (str: String) => {
  return str.length === 0 ? '' : str.length === 1 ? '0' + str : str;
};

export const TIMEZONE_OFFSET_VALUE = 8; // Singapore Timezone (UTC +8)
export const TIMEZONE_OFFSET = `'+${padLeftWithOneZero(
  TIMEZONE_OFFSET_VALUE.toString(),
)}:00'`;
export const DAY_NAMES = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];
export const TWELVE_HOUR_CONVERSION = [
  { hours: '00', phase: 'AM' },
  { hours: '01', phase: 'AM' },
  { hours: '02', phase: 'AM' },
  { hours: '03', phase: 'AM' },
  { hours: '04', phase: 'AM' },
  { hours: '05', phase: 'AM' },
  { hours: '06', phase: 'AM' },
  { hours: '07', phase: 'AM' },
  { hours: '08', phase: 'AM' },
  { hours: '09', phase: 'AM' },
  { hours: '10', phase: 'AM' },
  { hours: '11', phase: 'AM' },
  { hours: '12', phase: 'PM' },
  { hours: '01', phase: 'PM' },
  { hours: '02', phase: 'PM' },
  { hours: '03', phase: 'PM' },
  { hours: '04', phase: 'PM' },
  { hours: '05', phase: 'PM' },
  { hours: '06', phase: 'PM' },
  { hours: '07', phase: 'PM' },
  { hours: '08', phase: 'PM' },
  { hours: '09', phase: 'PM' },
  { hours: '10', phase: 'PM' },
  { hours: '11', phase: 'PM' },
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
