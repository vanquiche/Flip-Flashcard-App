import sortWeek from '../sortWeek';

function createWeek(days) {
  let week = [];
  for (let i = days; i > 0; i--) {
    const oneday = 24 * 60 * 60 * 1000;
    const date = new Date(new Date() - oneday * (i - 1));
    week.push(date);
  }
  return week;
}

const date1 = sortWeek(createWeek(3))
const date7 = sortWeek(createWeek(7))
const dateOld = sortWeek([new Date(), new Date(new Date() - (8 * 24 * 60 * 60 * 1000))])
const date1compare = createWeek(4)


describe('sortWeek fuction test', () => {
  xtest('add new date to empty array', () => {
    expect(sortWeek([])).toStrictEqual([1]);
  });

  test('add new date to array of 3', () => {
    expect(date1.length).toStrictEqual(4);
  });

  test('add new date to array of 7', () => {
    expect(date7.length).toBe(7);
  });

  test('return new array when last day is seven days old', () => {
    expect(dateOld.length).toBe(1)
  })
});
