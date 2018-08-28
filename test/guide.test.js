const guide = require('../js/guide');

test('clicks the Ready button and goes to Game', () => {
  expect(guide.goToGameWindow()).not.toBe(null);
});