const loginStreak = (login: Date | number) => {
  // return false if login is null or undefined
  if (!login) {
    return null;
  } else {
    // convert date to miliseconds
    const lastLogin = login.valueOf();
    const today = new Date().valueOf();

    const oneday = 24 * 60 * 60 * 1000;
    const twodays = oneday * 2;

    //  make sure larger number is on left side to produce positive difference
    const diff = today > lastLogin ? today - lastLogin : lastLogin - today;

    // last login date is less than one day or past two days
    if (diff <= oneday) return null;
    // last login in is at least 2 days old and past streak
    if (diff >= twodays) return false;
    // last login date is greater than one day but less than two days
    if (diff >= oneday && diff <= twodays) return true;
  }
};

export default loginStreak;
