const { transformText } = require('../src/scripts/tools');

describe('transformText', () => {
  test('uppercases text', () => {
    expect(transformText('abc', 'upper')).toBe('ABC');
  });

  test('lowercases text', () => {
    expect(transformText('ABC', 'lower')).toBe('abc');
  });

  test('reverses text', () => {
    expect(transformText('abc', 'reverse')).toBe('cba');
  });
});
