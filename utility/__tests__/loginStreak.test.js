import { DateTime } from 'luxon';
import loginStreak from '../loginStreak';

const dt = DateTime;

// represent logins
const loggedInYesterday = dt.now().minus({ days: 1 }).toISO();
const loggedInTwoDaysAgo = dt.now().minus({ days: 2 }).toISO();
const today = dt.now().toISO();

const thisDayOneWeekAgo = dt.now().minus({ days: 7 }).toISO();

describe('loginStreak function test', () => {
  test('last login: yesterday', () => {
    expect(loginStreak(loggedInYesterday)).toBe(true);
  });

  test('last login: two days ago', () => {
    expect(loginStreak(loggedInTwoDaysAgo)).toBe(false);
  });

  test('parameter is null', () => {
    expect(loginStreak(null)).toBe(null);
  });

  test('paremeter is undefined', () => {
    expect(loginStreak(undefined)).toBe(null);
  });

  test('logged In today', () => {
    expect(loginStreak(today)).toBe(null);
  });

  test('same weekday, different weeknumber', () => {
    expect(loginStreak(thisDayOneWeekAgo)).toBe(false);
  });
});
