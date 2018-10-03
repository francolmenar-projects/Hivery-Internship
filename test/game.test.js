const game = require('../js/game');

test('clicks the Ready button and goes to Game', () => {
  expect(game.goToGameOver()).not.toBe(null);
});