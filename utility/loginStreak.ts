import { DateTime } from 'luxon';

const loginStreak = (login: string) => {
  // return false if login is null or undefined
  if (!login) {
    return null;
  } else {
    const dt = DateTime;
    const lastLogin = dt.fromISO(login);
    const today = dt.now();
    const yesterday = dt.now().minus({ days: 1 });

    // check if login is consequtive
    const inStreak =
      yesterday.weekday === lastLogin.weekday &&
      today.weekNumber === lastLogin.weekNumber;

    const outOfStreak = today.diff(lastLogin, 'days').days > 2;

    if (inStreak) return true;
    else if (outOfStreak) return false;
    else return null;
  }
};

export default loginStreak;
