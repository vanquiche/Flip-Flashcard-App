import { DateTime } from 'luxon';

const sortWeek = (week: string[]) => {
  const latestLogin = DateTime.fromISO(week[week.length - 1]);
  const today = DateTime.now();
  const diff = latestLogin.diff(today, 'days').toObject();

  // if diff is greater than 0 then last login is
  // past 7 days
  // if diff is less than 0 then last login is
  // before 7 days
  if (diff.days) {
    if (diff.days >= 7) {
      // if last login is more than 7 days old, return new array with today's date
      // to ensure that dates are always within same week
      const updated = [today.toISO()];
      return updated;
    }
  }
  if (week.length >= 7) {
    // reach end of week, start a new week
    const updated = [today.toISO()];
    return updated;
  } else {
    // if week is less than 7 days then add new date to end
    const updated = week.concat(today.toISO());
    return updated;
  }
};

export default sortWeek;
