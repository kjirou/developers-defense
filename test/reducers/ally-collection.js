const assert = require('power-assert');

const { ACTION_TYPES, PARAMETERS } = require('../../src/immutable/constants');
const {
  _createInitialState,
  reduceAllyCollection,
} = require('../../src/reducers/ally-collection');
const { createNewUnitState } = require('../../src/state-models/unit');
const { createNewUnitCollectionState } = require('../../src/state-models/unit-collection');


describe('reducers/ally-collection', () => {
  describe('initialState', () => {
    it('should be set at first', () => {
      const state = reduceAllyCollection(undefined, { type: ACTION_TYPES.NOOP });
      assert.strictEqual(state instanceof Array, true);
    });
  });

  describe('UPDATE_ALLY', () => {
    let state;

    beforeEach(() => {
      state = reduceAllyCollection(undefined, {
        type: ACTION_TYPES.UPDATE_ALLY_COLLECTION,
        allyCollection: createNewUnitCollectionState().concat([
          createNewUnitState(),
          createNewUnitState(),
        ]),
      });
    });

    it('can update the specified ally', () => {
      const newFirstAlly = Object.assign({}, state[0], {
        maxHp: 100,
      });

      const newState = reduceAllyCollection(state, {
        type: ACTION_TYPES.UPDATE_ALLY,
        ally: newFirstAlly,
      });

      assert.strictEqual(state[0].maxHp, 1);
      assert.strictEqual(newState[0].maxHp, 100);
    });

    it('should throw a error if the specified ally does not exist', () => {
      assert.throws(() => {
        reduceAllyCollection(state, {
          type: ACTION_TYPES.UPDATE_ALLY,
          ally: createNewUnitState(),
        });
      }, /ally\.uid/);
    });
  });
});
