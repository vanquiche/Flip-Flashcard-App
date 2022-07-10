import { DateTime } from 'luxon';

const useCheckDate = (loginDate: string ) => {
  const dt = DateTime;
  const today = dt.now()

  const isSameDay = today.weekday === dt.fromISO(loginDate).weekday

  return {
    isSameDay
  }
}

export default useCheckDate;