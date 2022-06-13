import { DateTime } from 'luxon';
import loginStreak from '../loginStreak';

const dt = DateTime
const yesterday = dt.now().minus({hours: 25}).toISO();
const twoDaysLater = dt.now().minus({days: 2}).toISO();
const before24 = dt.now().minus({hours: 23}).toISO();


xdescribe('loginStreak function test', () => {
  test('last login: yesterday', () => {
    expect(loginStreak(yesterday)).toBe(true);
  });

  test('last login: two days ago', () => {
    expect(loginStreak(twoDaysLater)).toBe(false);
  });

  test('login before 24 hours', () => {
    expect(loginStreak(before24)).toBe(null);
  });

  test('parameter is null', () => {
    expect(loginStreak(null)).toBe(null);
  });

  test('paremeter is undefined', () => {
    expect(loginStreak(undefined)).toBe(null);
  });
});
