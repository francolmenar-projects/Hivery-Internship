window.jQuery = window.$ = require('jquery');
const initial = require('../js/initial_window');

test('clicks the screen and goes to Introduction Page', () => {
    expect(initial.goToIntroduction()).not.toBe(null);
});