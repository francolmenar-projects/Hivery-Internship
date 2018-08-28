const introduction_page = require('../js/introduction_page');

test('clicks the Plat button and goes to Guide Page', () => {
  expect(introduction_page.goToGuide()).not.toBe(null);
});