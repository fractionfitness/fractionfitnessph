import { faker } from '@faker-js/faker';

import { TIMEZONE_OFFSET } from '@/config';
import { padLeftWithOneZero, padLeftWithTwoZeroes } from '@/lib/utils';

export const generateRandomDateTimeObj = () => {
  // might error if date beyond current is used so set max to 2022
  const year = faker.helpers.rangeToNumber({ min: 2019, max: 2022 }).toString();
  const month = faker.helpers.rangeToNumber({ min: 1, max: 12 }).toString();
  // random day currently doesn't check the session record's day of the week so very likely that the random day will not match
  // prevent february from having a day beyond 28
  const day = faker.helpers.rangeToNumber({ min: 1, max: 28 }).toString();
  const hours = faker.helpers.rangeToNumber({ min: 0, max: 23 }).toString();
  const mins = faker.helpers.rangeToNumber({ min: 0, max: 59 }).toString();
  const secs = faker.helpers.rangeToNumber({ min: 0, max: 59 }).toString();
  const ms = faker.helpers.rangeToNumber({ min: 0, max: 999 }).toString();

  const randomMysqlDatetimeString = `${year}-${padLeftWithOneZero(
    month,
  )}-${padLeftWithOneZero(day)}T${padLeftWithOneZero(
    hours,
  )}:${padLeftWithOneZero(mins)}:${padLeftWithOneZero(
    secs,
  )}.${padLeftWithTwoZeroes(ms)}${TIMEZONE_OFFSET}`;
  return new Date(randomMysqlDatetimeString);
};
