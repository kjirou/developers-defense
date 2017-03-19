const assert = require('power-assert');

const { BOARD_TYPES } = require('../../src/immutable/constants');
const { cloneViaJson } = require('../../src/lib/core');
const {
  createNewPlacementState,
  areSamePlacements,
} = require('../../src/state-models/placement');
const { createNewCoordinateState } = require('../../src/state-models/coordinate');


describe('state-models/placement', () => {
  describe('areSamePlacements', () => {
    it('should be executed correctly', () => {
      const p1 = createNewPlacementState(BOARD_TYPES.BATTLE_BOARD, createNewCoordinateState(0, 1));
      const p2 = createNewPlacementState(BOARD_TYPES.SORTIE_BOARD, createNewCoordinateState(0, 1));
      const p3 = createNewPlacementState(BOARD_TYPES.BATTLE_BOARD, createNewCoordinateState(1, 1));
      const p4 = createNewPlacementState(BOARD_TYPES.BATTLE_BOARD, createNewCoordinateState(0, 2));

      assert(areSamePlacements(p1, cloneViaJson(p1)));
      assert(areSamePlacements(p2, cloneViaJson(p2)));
      assert(areSamePlacements(p3, cloneViaJson(p3)));
      assert(areSamePlacements(p4, cloneViaJson(p4)));

      assert(areSamePlacements(p1, p2) === false);
      assert(areSamePlacements(p1, p3) === false);
      assert(areSamePlacements(p1, p4) === false);
    });
  });
});
