const assert = require('power-assert');

const { BOARD_TYPES } = require('../../src/immutable/constants');
const { cloneViaJson } = require('../../src/lib/core');
const {
  createNewPlacementState,
  areSamePlacements,
} = require('../../src/state-models/placement');


describe('state-models/placement', () => {
  describe('areSamePlacements', () => {
    it('should be executed correctly', () => {
      const p = createNewPlacementState();

      const p1 = createNewPlacementState();
      p1.boardType = BOARD_TYPES.BATTLE_BOARD;
      p1.coordinate = [0, 1];

      const p2 = createNewPlacementState();
      p2.boardType = BOARD_TYPES.SORTIE_BOARD;
      p2.coordinate = [0, 1];

      const p3 = createNewPlacementState();
      p3.boardType = BOARD_TYPES.BATTLE_BOARD;
      p3.coordinate = [1, 1];

      const p4 = createNewPlacementState();
      p4.boardType = BOARD_TYPES.BATTLE_BOARD;
      p4.coordinate = [0, 2];

      assert(areSamePlacements(p, cloneViaJson(p)));
      assert(areSamePlacements(p1, cloneViaJson(p1)));
      assert(areSamePlacements(p2, cloneViaJson(p2)));
      assert(areSamePlacements(p3, cloneViaJson(p3)));
      assert(areSamePlacements(p4, cloneViaJson(p4)));

      assert(areSamePlacements(p, p1) === false);
      assert(areSamePlacements(p1, p2) === false);
      assert(areSamePlacements(p1, p3) === false);
      assert(areSamePlacements(p1, p4) === false);
    });
  });
});
