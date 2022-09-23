import { DateTime } from 'luxon';

const loginStreak = (login: string) => {
  // return false if login is null or undefined
  if (!login) {
    return null;
  } else {
    const dt = DateTime;
    const lastLogin = dt.fromISO(login);
    const today = dt.now();

    const sameday = lastLogin.weekday === today.weekday;
    const inStreak = dt.now().minus({ days: 1 }).weekday === lastLogin.weekday;

    const outOfStreak = today.diff(lastLogin, 'days').days > 2;

    if (sameday || inStreak) return true;
    else if (outOfStreak) return false;
    else return null;
  }
};

export default loginStreak;
