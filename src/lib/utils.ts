// some server components may need to use this file | will this affect server-side rendering?
// import 'client-only';

import { type ClassValue, clsx } from 'clsx';
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

// generates a datetime obj that will be used to constrain employee check ins to only once per day (unique constraint on employee checkins on a group)
// time portion is set to 12:00MN/24:00 local time
export const convertToMysqlDateString = (dateObj) => {
  const year = dateObj.getFullYear().toString();
  // getMonth returns a value of 0-11 for the 12 months
  const month = `${padLeftWithOneZero((dateObj.getMonth() + 1).toString())}`;
  const day = `${padLeftWithOneZero(dateObj.getDate().toString())}`;

  return `${year}-${month}-${day}T00:00:00.000${TIMEZONE_OFFSET}`;
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

// returns true if dateObj is the same day of the week (weekdays: sun to sat) as the session.day
export const compareDateObjToSessionDay = (dateObj, sessionDay) => {
  const { dayOfWeek } = convertDateObjValuesToStringValues(
    getJsDateObjValues(dateObj),
  );
  // fix this after adjusting Session model's day field to integer (0-6) representing dayOfTheWeek
  return dayOfWeek === sessionDay.toLowerCase();
};

// check if time occured in interval

export const addOneDayToDateObj = (dateObj) =>
  new Date(dateObj.getTime() + 24 * 60 * 60 * 1000);

export const didDateOccurInASpecific24HourPeriod = (dateObj, specificDay) => {
  return specificDay <= dateObj && dateObj < addOneDayToDateObj(specificDay);
};

export const sortDates = (datesArr, sortKey, order = 'desc') => {
  if (order === 'desc')
    return datesArr.sort(
      (objA, objB) => Number(objB[sortKey]) - Number(objA[sortKey]),
    );
  if (order === 'asc')
    return datesArr.sort(
      (objA, objB) => Number(objA[sortKey]) - Number(objB[sortKey]),
    );
};

// returns true if current time is in between session interval
// export const compareCurrentTimeToInterval = ([
export const isCurrentSession = ([
  start_at,
  end_at,
  current_time = new Date(),
]) => {
  const [startSecs, endSecs, currTimeSecs] = [
    start_at,
    end_at,
    current_time,
  ].map((dateObj) => {
    return getTimeInSecsFromDateObj(getJsDateObjValues(dateObj));
  });

  const { time } = convertDateObjValuesToStringValues(
    getJsDateObjValues(current_time),
  );
  // console.log('isCurrent compare secs', startSecs, endSecs, currTimeSecs);
  // console.log(
  //   'isCurrent compare time',
  //   convertTwoDatesToTimeInterval([start_at, end_at]),
  //   time,
  //   startSecs <= currTimeSecs && currTimeSecs < endSecs,
  // );

  return startSecs <= currTimeSecs && currTimeSecs < endSecs;
};

export const isUpcomingSession = ([
  start_at,
  end_at,
  current_time = new Date(),
]) => {
  const [startSecs, endSecs, currTimeSecs] = [
    start_at,
    end_at,
    current_time,
  ].map((dateObj) => {
    return getTimeInSecsFromDateObj(getJsDateObjValues(dateObj));
  });

  return currTimeSecs < startSecs;
};

export const isCompletedSession = ([
  start_at,
  end_at,
  current_time = new Date(),
]) => {
  const [startSecs, endSecs, currTimeSecs] = [
    start_at,
    end_at,
    current_time,
  ].map((dateObj) => {
    return getTimeInSecsFromDateObj(getJsDateObjValues(dateObj));
  });

  return endSecs <= currTimeSecs;
};
