const assert = require('power-assert');

const { _createInitialState, reduceGameStatus } = require('../../src/reducers/game-status');


describe('reducers/game-status', () => {
  describe('initialState', () => {
    it('should be set at first', () => {
      const state = reduceGameStatus(undefined, {});
      assert.deepStrictEqual(state, _createInitialState());
    });
  });
});
