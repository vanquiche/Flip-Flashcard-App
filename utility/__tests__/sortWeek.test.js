import sortWeek from '../sortWeek';
import { DateTime } from 'luxon';

const dt = DateTime

const sevendaysAgo = dt.now().minus({days: 8}).toISO()
const sixdaysAgo = dt.now().minus({days: 6}).toISO()
const fivedaysAgo = dt.now().minus({days: 5}).toISO()

function createWeek(days) {
  let week = [];
  for (let i = days; i > 0; i--) {
    const date = dt.now().minus({days: i}).toISO();
    week.push(date);
  }
  return week;
}

const empty = sortWeek([])
const date1 = sortWeek(createWeek(3))
const date7 = sortWeek(createWeek(7))
const dateOld = sortWeek([fivedaysAgo, sixdaysAgo, sevendaysAgo])
// const date1compare = createWeek(4)


xdescribe('sortWeek fuction test', () => {
  test('add new date to empty array', () => {
    expect(empty.length).toStrictEqual(1);
  });

  test('add new date to array of 3', () => {
    expect(date1.length).toStrictEqual(4);
  });

  test('replace array of 7', () => {
    expect(date7.length).toBe(1);
  });

  test('return new array when last day is older than seven days', () => {
    expect(dateOld.length).toBe(1)
  })
});
