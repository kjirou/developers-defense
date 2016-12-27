const assert = require('power-assert');

const { BOARD_TYPES } = require('../../src/immutable/constants');
const { cloneViaJson } = require('../../src/lib/core');
const {
  createNewPlacementState,
  areSamePlace,
} = require('../../src/state-models/placement');


describe('state-models/placement', () => {
  describe('areSamePlace', () => {
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

      assert(areSamePlace(p, cloneViaJson(p)));
      assert(areSamePlace(p1, cloneViaJson(p1)));
      assert(areSamePlace(p2, cloneViaJson(p2)));
      assert(areSamePlace(p3, cloneViaJson(p3)));
      assert(areSamePlace(p4, cloneViaJson(p4)));

      assert(areSamePlace(p, p1) === false);
      assert(areSamePlace(p1, p2) === false);
      assert(areSamePlace(p1, p3) === false);
      assert(areSamePlace(p1, p4) === false);
    });
  });
});
