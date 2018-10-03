const sum = require('../js/initial_window');
window.$ = require('https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js');

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});