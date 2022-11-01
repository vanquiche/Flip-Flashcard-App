import { DateTime } from 'luxon';
import checkDate from '../checkDate';

const dt = DateTime;
const today = dt.now();

const minusTwoHours = today.minus({ hours: 2 });
const plusTwoHours = today.plus({ hours: 2 });
const minusOneDay = today.minus({ days: 1.5 });
const minusOneWeek = today.minus({ days: 7 });

xdescribe('Check Date function', () => {
  it('returns true if same day', () => {
    expect(checkDate(minusTwoHours)).toBe(true);
    expect(checkDate(plusTwoHours)).toBe(true);
  });

  it('returns false if arg is day old', () => {
    expect(checkDate(minusOneDay)).toBe(false);
  });

  it('returns false if same day but different week', () => {
    expect(checkDate(minusOneWeek)).toBe(false);
  });
});
