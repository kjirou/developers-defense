const assert = require('power-assert');

const { ACTION_TYPES, PARAMETERS } = require('../../src/immutable/constants');
const {
  _createInitialState,
  reduceAllies,
} = require('../../src/reducers/allies');
const { createNewUnitState } = require('../../src/state-models/unit');
const { createNewUnitCollectionState } = require('../../src/state-models/unit-collection');


describe('reducers/allies', () => {
  describe('initialState', () => {
    it('should be set at first', () => {
      const state = reduceAllies(undefined, { type: ACTION_TYPES.NOOP });
      assert.strictEqual(state instanceof Array, true);
    });
  });

  describe('UPDATE_ALLY', () => {
    let state;

    beforeEach(() => {
      state = reduceAllies(undefined, {
        type: ACTION_TYPES.UPDATE_ALLY_COLLECTION,
        allies: createNewUnitCollectionState().concat([
          createNewUnitState(),
          createNewUnitState(),
        ]),
      });
    });

    it('can update the specified ally', () => {
      const newFirstAlly = Object.assign({}, state[0], {
        maxHp: 100,
      });

      const newState = reduceAllies(state, {
        type: ACTION_TYPES.UPDATE_ALLY,
        ally: newFirstAlly,
      });

      assert.strictEqual(state[0].maxHp, 1);
      assert.strictEqual(newState[0].maxHp, 100);
    });

    it('should throw a error if the specified ally does not exist', () => {
      assert.throws(() => {
        reduceAllies(state, {
          type: ACTION_TYPES.UPDATE_ALLY,
          ally: createNewUnitState(),
        });
      }, /ally\.uid/);
    });
  });
});
