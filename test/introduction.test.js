window.jQuery = window.$ = require('jquery');
const initial = require('../js/introduction_page.js');

test('clicks the Play button and goes to Guide Page', () => {
    expect(initial.goToGuide()).not.toBe(null);
});
