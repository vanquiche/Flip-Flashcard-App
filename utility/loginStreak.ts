import { DateTime } from 'luxon';

const loginStreak = (login: string) => {
  // return false if login is null or undefined
  if (!login) {
    return null;
  } else {
    // convert date to miliseconds
    const dt = DateTime;
    const lastLogin = dt.fromISO(login);
    const today = dt.now();

    const { hours } = today.diff(lastLogin, 'hours').toObject();

    // last login date is less than one day or past two days
    if (hours) {
      if (hours < 24) return null;
      // last login in is at least 2 days old and past streak
      else if (hours > 48) return false;
      // last login date is greater than one day but less than two days
      else if (hours > 24 && hours < 48) return true;
    }
  }
};

export default loginStreak;
