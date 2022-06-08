
const sortWeek = (week: Date[]) => {
  const latestLogin = new Date(week[week.length - 1]).getTime();
  const sevenDaysAgo = new Date().getTime() - (7 * 24 * 60 * 60 * 1000);

  // if diff is greater than 0 then last login is
  // past 7 days
  // if diff is less than 0 then last login is
  // before 7 days
  if (sevenDaysAgo > latestLogin) {
    // if last login is more than 7 days old, return new array with today's date
    // to ensure that dates are always within same week
    const updated = [new Date()]
    return updated
  }
  if (week.length >= 7) {
    // reach end of week, start a new week
    const updated = [new Date()];
    return updated;
  } else {
    // if week is less than 7 days then add new date to end
    const updated = week.concat(new Date());
    return updated;
  }
};

export default sortWeek;
