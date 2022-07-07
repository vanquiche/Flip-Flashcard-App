import { DateTime } from 'luxon';
import loginStreak from '../loginStreak';

const dt = DateTime

// represent logins
const sameDay = dt.now().minus({hours: 16}).toISO();
const loggedInYesterday = dt.now().minus({days: 1}).toISO();
const loggedInTwoDaysAgo = dt.now().minus({days: 2}).toISO();


xdescribe('loginStreak function test', () => {
  test('last login: yesterday', () => {
    expect(loginStreak(loggedInYesterday)).toBe(true);
  });

  test('last login: two days ago', () => {
    expect(loginStreak(loggedInTwoDaysAgo)).toBe(false);
  });

  test('login before 24 hours', () => {
    expect(loginStreak(sameDay)).toBe(null);
  });

  test('parameter is null', () => {
    expect(loginStreak(null)).toBe(null);
  });

  test('paremeter is undefined', () => {
    expect(loginStreak(undefined)).toBe(null);
  });
});
