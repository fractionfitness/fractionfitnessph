// some server components may need to use this file | will this affect server-side rendering?
// import 'client-only';

import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { DAY_NAMES, TIMEZONE_OFFSET, TWELVE_HOUR_CONVERSION } from '@/config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalizeFirstChar = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1, str.length).toLowerCase();

export const capitalizeAllWords = (words) => {
  return words
    .split(' ')
    .map((word) => capitalizeFirstChar(word))
    .join(' ');
};

export const padLeftWithOneZero = (str: String) => {
  return str.length === 0 ? '' : str.length === 1 ? '0' + str : str;
};

export const padLeftWithTwoZeroes = (str: String) => {
  return str.length === 0
    ? ''
    : str.length === 1
    ? '00' + str
    : str.length === 2
    ? '0' + str
    : str;
};

export const convertToMysqlDatetimeString = (dateObj) => {
  const year = dateObj.getFullYear().toString();
  // getMonth returns a value of 0-11 for the 12 months
  const month = `${padLeftWithOneZero((dateObj.getMonth() + 1).toString())}`;
  const day = `${padLeftWithOneZero(dateObj.getDate().toString())}`;
  const hours = `${padLeftWithOneZero(dateObj.getHours().toString())}`;
  const mins = `${padLeftWithOneZero(dateObj.getMinutes().toString())}`;
  const secs = `${padLeftWithOneZero(dateObj.getSeconds().toString())}`;
  const ms = `${padLeftWithTwoZeroes(dateObj.getMilliseconds().toString())}`;

  return `${year}-${month}-${day}T${hours}:${mins}:${secs}.${ms}${TIMEZONE_OFFSET}`;
};

export const getJsDateObjValues = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  const dayOfWeek = dateObj.getDay();
  const hours = dateObj.getHours();
  const mins = dateObj.getMinutes();
  const secs = dateObj.getSeconds();

  return {
    year,
    month,
    day,
    dayOfWeek,
    hours,
    mins,
    secs,
  };
};

export const convertDateObjValuesToStringValues = (dateObjValues) => {
  const {
    year,
    month,
    day,
    dayOfWeek,
    hours: militaryHours,
    mins,
    secs,
  } = dateObjValues;
  const { hours, phase } = TWELVE_HOUR_CONVERSION[militaryHours];

  return {
    year: year.toString(),
    // JavaScript counts months from 0 to 11
    month: `${padLeftWithOneZero((month + 1).toString())}`,
    day: `${padLeftWithOneZero(day.toString())}`,
    dayOfWeek: DAY_NAMES[dayOfWeek],
    time: `${padLeftWithOneZero(hours.toString())}:${padLeftWithOneZero(
      mins.toString(),
    )}${phase}`,
    mins: `${padLeftWithOneZero(mins.toString())}`,
    secs: `${padLeftWithOneZero(secs.toString())}`,
  };
};

export const convertTwoDatesToTimeInterval = (
  dateObjects: Array<string>,
  // dateObjects: string[],
) => {
  const [start, end] = dateObjects.map((item) =>
    convertDateObjValuesToStringValues(getJsDateObjValues(item)),
  );
  return `${start.time} - ${end.time}`;
};

// gets hours, mins, secs from Date obj and converts that into secs
// does not give secs since 1970
// excludes millisecs
export const getTimeInSecsFromDateObj = ({ hours, mins, secs }) => {
  // return hours * 60 + mins;
  return hours * 60 * 60 + mins * 60 + secs;
};
