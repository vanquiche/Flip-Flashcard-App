import { DateTime } from 'luxon';

const checkDate = (loginDate: string) => {
  const dt = DateTime;
  const today = dt.now();
  const userLogin = dt.fromISO(loginDate);

  // check if same weekday (M - F) and same weeknumber (1 - 52)
  const isSameDay =
    today.weekday === userLogin.weekday &&
    today.weekNumber === userLogin.weekNumber;

  return isSameDay;
};

export default checkDate;
