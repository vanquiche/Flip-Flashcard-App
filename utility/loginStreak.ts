import { DateTime } from 'luxon';

const loginStreak = (login: string) => {
  // return false if login is null or undefined
  if (!login) {
    return null;
  } else {
    const dt = DateTime;
    const lastLogin = dt.fromISO(login);
    const today = dt.now();

    const sameday = lastLogin.weekday == today.weekday;
    const inStreak = today.weekday - 1 === lastLogin.weekday;

    const outOfStreak = today.diff(lastLogin, 'days').days > 2;

    if (sameday) return null;
    else if (outOfStreak) return false;
    else if (inStreak) return true;
  }
};

export default loginStreak;
