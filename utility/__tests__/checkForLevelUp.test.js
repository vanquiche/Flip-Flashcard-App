import checkForLevelUp from '../checkForLevelUp';

describe('checkForLevelUp function test', () => {
  test('does not meet requirement to level up', () => {
    expect(checkForLevelUp(125, 10, 100)).toBe(0);
  });

  test('level up once', () => {
    expect(checkForLevelUp(185, 37, 100)).toBe(1);
  });

  test('level up twice', () => {
    expect(checkForLevelUp(190, 125, 100)).toBe(2);
  });

  test('no params passed equals 0', () => {
    expect(checkForLevelUp()).toBe(0);
  });

  test('string passed in param works as normal', () => {
    expect(checkForLevelUp('132', '456', '100')).toBe(4);
  });

    test('short of level up', () => {
    expect(checkForLevelUp(198, 1, 100)).toBe(0)
  })
});
