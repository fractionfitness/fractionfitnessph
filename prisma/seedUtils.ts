import { faker } from '@faker-js/faker';

const padLeftWithOneZero = (str: String) => {
  return str.length === 1 ? '0' + str : str;
};

const padLeftWithTwoZeroes = (str: String) => {
  return str.length === 1 ? '00' + str : str.length === 2 ? '0' + str : str;
};

export const generateRandomDateTimeString = () => {
  // might error if date beyond current is used so set max to 2022
  const year = faker.helpers.rangeToNumber({ min: 2019, max: 2022 }).toString();
  const month = faker.helpers.rangeToNumber({ min: 1, max: 12 }).toString();
  // random day currently doesn't check the session record's day of the week so very likely that the random day will not match
  // prevent february from having a day beyond 28
  const day = faker.helpers.rangeToNumber({ min: 1, max: 28 }).toString();
  const hr = faker.helpers.rangeToNumber({ min: 0, max: 23 }).toString();
  const mins = faker.helpers.rangeToNumber({ min: 0, max: 59 }).toString();
  const secs = faker.helpers.rangeToNumber({ min: 0, max: 59 }).toString();
  const ms = faker.helpers.rangeToNumber({ min: 0, max: 999 }).toString();
  // Singapore Timezone (UTC +8)
  const tz = '+08:00';
  const randomDateTimeString = `${year}-${padLeftWithOneZero(
    month,
  )}-${padLeftWithOneZero(day)}T${padLeftWithOneZero(hr)}:${padLeftWithOneZero(
    mins,
  )}:${padLeftWithOneZero(secs)}.${padLeftWithTwoZeroes(ms)}${tz}`;
  return randomDateTimeString;
};
