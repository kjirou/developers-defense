const assert = require('power-assert');

const { _createInitialState, reduceGameStatus } = require('../../src/reducers/game-status');


describe('reducers/game-status', () => {
  describe('initialState', () => {
    it('should be set at first', () => {
      const state = reduceGameStatus(undefined, {});
      assert.deepStrictEqual(state, _createInitialState());
    });
  });

  describe('ALTER_PROGRESS', () => {
    let stateValue0;

    beforeEach(() => {
      stateValue0 = Object.assign(_createInitialState(), { progress: 0 });
    });

    it('should not break before state', () => {
      reduceGameStatus(stateValue0, { type: 'ALTER_PROGRESS', delta: 1 });
      assert.strictEqual(stateValue0.progress, 0);
    });

    it('0 + 1 => 1', () => {
      const state = reduceGameStatus(stateValue0, { type: 'ALTER_PROGRESS', delta: 1 });
      assert.strictEqual(state.progress, 1);
    });

    it('0 + 1 + 99 => 100', () => {
      let state = reduceGameStatus(stateValue0, { type: 'ALTER_PROGRESS', delta: 1 });
      state = reduceGameStatus(state, { type: 'ALTER_PROGRESS', delta: 99 });
      assert.strictEqual(state.progress, 100);
    });

    it('0 + 101 => 100', () => {
      const state = reduceGameStatus(stateValue0, { type: 'ALTER_PROGRESS', delta: 101 });
      assert.strictEqual(state.progress, 100);
    });

    it('0 + 10 - 9 => 1', () => {
      let state = reduceGameStatus(stateValue0, { type: 'ALTER_PROGRESS', delta: 10 });
      state = reduceGameStatus(state, { type: 'ALTER_PROGRESS', delta: -9 });
      assert.strictEqual(state.progress, 1);
    });

    it('0 - 1 => 0', () => {
      const state = reduceGameStatus(stateValue0, { type: 'ALTER_PROGRESS', delta: -1 });
      assert.strictEqual(state.progress, 0);
    });
  });
});
