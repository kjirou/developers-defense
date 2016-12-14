const assert = require('power-assert');

const { _createInitialState, _findSquareByMatrix, reduceBattleSquares
  } = require('../../src/reducers/battle-squares');


describe('reducers/battle-squares', () => {
  describe('initialState', () => {
    it('should be set at first', () => {
      const state = reduceBattleSquares(undefined, { type: 'NOOP' });
      assert.deepStrictEqual(state, _createInitialState());
    });

    it('should initialize matrix properties', () => {
      const state = reduceBattleSquares(undefined, { type: 'NOOP' });

      for (let rowIndex = 0; rowIndex < state.length; rowIndex += 1) {
        const rowSquares = state[rowIndex];
        for (let columnIndex = 0; columnIndex < rowSquares.length; columnIndex += 1) {
          const square = state[rowIndex][columnIndex];
          assert.deepStrictEqual([rowIndex, columnIndex], square.matrix);
        }
      }
    });
  });

  describe('EXCHANGE_COIN_LOCATIONS', () => {
    let state;

    beforeEach(() => {
      state = _createInitialState();
      _findSquareByMatrix(state, [0, 0]).coinType = 'TEN';
      _findSquareByMatrix(state, [1, 1]).coinType = 'FIFTY';
    });

    it('can exchange from [0, 0] to [1, 1]', () => {
      assert.strictEqual(_findSquareByMatrix(state, [0, 0]).coinType, 'TEN');
      assert.strictEqual(_findSquareByMatrix(state, [1, 1]).coinType, 'FIFTY');
      state = reduceBattleSquares(state, { type: 'EXCHANGE_COIN_LOCATIONS', fromMatrix: [0, 0], toMatrix: [1, 1] });
      assert.strictEqual(_findSquareByMatrix(state, [0, 0]).coinType, 'FIFTY');
      assert.strictEqual(_findSquareByMatrix(state, [1, 1]).coinType, 'TEN');
    });

    it('should not break before state', () => {
      const newState = reduceBattleSquares(state, { type: 'EXCHANGE_COIN_LOCATIONS', fromMatrix: [0, 0], toMatrix: [1, 1] });

      const square = _findSquareByMatrix(newState, [0, 0]);
      square.coinType = 'FIFTY';

      assert.strictEqual(_findSquareByMatrix(state, [0, 0]).coinType, 'TEN');
      assert.strictEqual(_findSquareByMatrix(newState, [0, 0]).coinType, 'FIFTY');
    });
  });
});
