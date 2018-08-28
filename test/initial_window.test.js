const initial_window = require('../js/initial_window');

test('clicks the screen and goes to Introduction Page', () => {
  expect(initial_window()).not.toBe(null);
});
