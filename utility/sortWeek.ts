import { DateTime } from 'luxon';

const sortWeek = (week: string[]) => {
  const dt = DateTime;
  // get start of current week
  const startOfWeek = dt.now().startOf('week').minus({ days: 1 }).toMillis();

  const newWeek = week.filter((w) => {
    const date = dt.fromISO(w).toMillis();
    // filter dates later than start of current week
    if (date >= startOfWeek) {
      return w;
    }
  });

  // return latest week with todays date
  return newWeek.concat(dt.now().toISO());
};

export default sortWeek;
