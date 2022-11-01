import sortWeek from '../sortWeek';
import { DateTime } from 'luxon';

const dt = DateTime;

const sevendaysAgo = dt.now().minus({ days: 8 }).toISO();
const sixdaysAgo = dt.now().minus({ days: 6 }).toISO();
const fivedaysAgo = dt.now().minus({ days: 5 }).toISO();

function createWeek(days) {
  let week = [];
  for (let i = days; i > 0; i--) {
    const date = dt.now().minus({ days: i }).toISO();
    week.push(date);
  }
  return week;
}

const currentWeek = sortWeek([
  dt.now().minus({ days: 2 }).toISO(),
  dt.now().minus({ days: 1 }).toISO(),
]);

const weekOld = sortWeek([fivedaysAgo, sixdaysAgo, sevendaysAgo]);

const previousWeek = sortWeek([
  dt.now().minus({ days: 4 }),
  dt.now().minus({ days: 3 }),
]);

/**
 * CASES
 *
 * - week has expired => returns new week
 * - last login is beginning of new week (Sunday) => returns new week
 * - login is within current week => return current list
 */

xdescribe('sortWeek fuction test', () => {
  test('empty week', () => {
    expect(sortWeek([]).length).toBe(1);
  });

  test('list is within current week', () => {
    expect(currentWeek.length).toBe(3);
  });

  test('list is one week expired', () => {
    expect(weekOld.length).toBe(1);
  });

  test('dates in list is previous week', () => {
    expect(previousWeek.length).toBe(1);
  });
});
