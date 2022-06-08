import loginStreak from '../loginStreak';

const oneday = 24 * 60 * 60 * 1000;

const sixHours = 6 * 60 * 60 * 1000;

const yesterday = new Date(Date.now() - oneday);
const today = new Date();

xdescribe('loginStreak function test', () => {
  test('last login: yesterday', () => {
    expect(loginStreak(yesterday)).toBe(true);
  });

  test('last login: two days ago', () => {
    expect(loginStreak(yesterday * 2)).toBe(false);
  });

  test('login earlier 6 hours ago', () => {
    expect(loginStreak(new Date(Date.now() - sixHours))).toBe(null);
  });

  test('login is equal to 24hrs', () => {
    expect(loginStreak(today)).toBe(null);
  });

  test('parameter is null', () => {
    expect(loginStreak(null)).toBe(null);
  });

  test('paremeter is undefined', () => {
    expect(loginStreak(undefined)).toBe(null);
  });
});
