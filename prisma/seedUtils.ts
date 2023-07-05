import { faker } from '@faker-js/faker';

import { TIMEZONE_OFFSET } from '@/config';

const padLeftWithOneZero = (str: String) => {
  return str.length === 0 ? '' : str.length === 1 ? '0' + str : str;
};

const padLeftWithTwoZeroes = (str: String) => {
  return str.length === 0
    ? ''
    : str.length === 1
    ? '00' + str
    : str.length === 2
    ? '0' + str
    : str;
};

export const generateRandomDateTimeObj = () => {
  // might error if date beyond current is used so set max to 2022
  const year = faker.helpers.rangeToNumber({ min: 2019, max: 2022 }).toString();
  const month = faker.helpers.rangeToNumber({ min: 1, max: 12 }).toString();
  // random day currently doesn't check the session record's day of the week so very likely that the random day will not match
  // prevent february from having a day beyond 28
  const day = faker.helpers.rangeToNumber({ min: 1, max: 28 }).toString();
  const hour = faker.helpers.rangeToNumber({ min: 0, max: 23 }).toString();
  const mins = faker.helpers.rangeToNumber({ min: 0, max: 59 }).toString();
  const secs = faker.helpers.rangeToNumber({ min: 0, max: 59 }).toString();
  const ms = faker.helpers.rangeToNumber({ min: 0, max: 999 }).toString();

  const randomMysqlDatetimeString = `${year}-${padLeftWithOneZero(
    month,
  )}-${padLeftWithOneZero(day)}T${padLeftWithOneZero(
    hour,
  )}:${padLeftWithOneZero(mins)}:${padLeftWithOneZero(
    secs,
  )}.${padLeftWithTwoZeroes(ms)}${TIMEZONE_OFFSET}`;
  return new Date(randomMysqlDatetimeString);
};

export const convertToMysqlDatetimeString = (dateObj) => {
  const year = dateObj.getFullYear().toString();
  // getMonth returns a value of 0-11 for the 12 months
  const month = `${padLeftWithOneZero((dateObj.getMonth() + 1).toString())}`;
  const day = `${padLeftWithOneZero(dateObj.getDate().toString())}`;
  const hour = `${padLeftWithOneZero(dateObj.getHours().toString())}`;
  const mins = `${padLeftWithOneZero(dateObj.getMinutes().toString())}`;
  const secs = `${padLeftWithOneZero(dateObj.getSeconds().toString())}`;
  const ms = `${padLeftWithTwoZeroes(dateObj.getMilliseconds().toString())}`;

  return `${year}-${month}-${day}T${hour}:${mins}:${secs}.${ms}${TIMEZONE_OFFSET}`;
};
