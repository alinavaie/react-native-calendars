const XDate = require('xdate');

export function padNumber(n: number) {
  if (n < 10) {
    return '0' + n;
  }
  return n;
}

export function xdateToData(date: XDate | string, needToConvert: boolean) {
  const d = date instanceof XDate ? date : new XDate(date);
  const dateString = toMarkingFormat(d);

  if (needToConvert) {
    const _28days = 2;
    const _31days = [1, 3, 5, 7, 8, 10, 12];
    const _30days = [4, 6, 9, 11];

    const isLastDayOfMonth =
      (d.getMonth() + 1 === _28days && d.getDate() === 28) ||
      (_31days.includes(d.getMonth() + 1) && d.getDate() === 31) ||
      (_30days.includes(d.getMonth() + 1) && d.getDate() === 30);
    const isTheLastDayOfYear = d.getMonth() + 1 === 12 && d.getDate() === 31;
    const year = isTheLastDayOfYear ? d.getFullYear() + 1 : d.getFullYear();
    const month = isTheLastDayOfYear ? 1 : isLastDayOfMonth ? d.getMonth() + 2 : d.getMonth() + 1;
    const day = isLastDayOfMonth ? 1 : d.getDate() + 1;
    return {
      year,
      month,
      day,
      timestamp: new XDate(dateString, true).getTime() + 86400000,
      dateString: `${year}-${month}-${day}`
    };
  }

  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    timestamp: new XDate(dateString, true).getTime(),
    dateString: dateString
  };
}

export function parseDate(d?: any) {
  if (!d) {
    return;
  } else if (d.timestamp) {
    // conventional data timestamp
    return new XDate(d.timestamp, true);
  } else if (d instanceof XDate) {
    // xdate
    return new XDate(toMarkingFormat(d), true);
  } else if (d.getTime) {
    // javascript date
    const dateString = d.getFullYear() + '-' + padNumber(d.getMonth() + 1) + '-' + padNumber(d.getDate());
    return new XDate(dateString, true);
  } else if (d.year) {
    const dateString = d.year + '-' + padNumber(d.month) + '-' + padNumber(d.day);
    return new XDate(dateString, true);
  } else if (d) {
    // timestamp number or date formatted as string
    return new XDate(d, true);
  }
}

export function toMarkingFormat(d: XDate) {
  if (!isNaN(d.getTime())) {
    const year = `${d.getFullYear()}`;
    const month = d.getMonth() + 1;
    const doubleDigitMonth = month < 10 ? `0${month}` : `${month}`;
    const day = d.getDate();
    const doubleDigitDay = day < 10 ? `0${day}` : `${day}`;
    return year + '-' + doubleDigitMonth + '-' + doubleDigitDay;
  }
  return 'Invalid Date';
}
