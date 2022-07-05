import { DateTime } from 'luxon';

const sortWeek = (week: string[]) => {
  const latestLogin = DateTime.fromISO(week[week.length - 1]);
  const today = DateTime.now();
  const diff = today.diff(latestLogin, 'days').toObject();

  if (diff.days) {
    if (diff.days >= 7 || week.length > 6) {
      // if last login is more than 7 days old, return new array with today's date
      // to ensure that dates are always within same week
      const updated = [today.toISO()];
      return updated;
    } else {
      // if week is less than 7 days then add new date to end
      const updated = week.concat(today.toISO());
      return updated;
    }
  } else return week
};

export default sortWeek;
