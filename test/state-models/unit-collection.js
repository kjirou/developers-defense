const assert = require('power-assert');

const { BOARD_TYPES } = require('../../src/constants');
const { createNewCoordinateState } = require('../../src/state-models/coordinate');
const { createNewPlacementState } = require('../../src/state-models/placement');
const { createNewUnitState } = require('../../src/state-models/unit');
const {
  createNewUnitCollectionState,
  findUnitByPlacement,
  findUnitByUid,
} = require('../../src/state-models/unit-collection');


describe('state-models/unit-collection', function() {
  describe('findUnitByPlacement', function() {
    beforeEach(function() {
      this.collection = createNewUnitCollectionState();

      this.collection.push(
        Object.assign({}, createNewUnitState(), {
          placement: createNewPlacementState(BOARD_TYPES.BATTLE_BOARD, createNewCoordinateState(0, 0)),
        })
      );
      this.collection.push(
        Object.assign({}, createNewUnitState(), {
          placement: createNewPlacementState(BOARD_TYPES.BATTLE_BOARD, createNewCoordinateState(0, 1)),
        })
      );
      this.collection.push(
        Object.assign({}, createNewUnitState(), {
          placement: createNewPlacementState(BOARD_TYPES.BATTLE_BOARD, createNewCoordinateState(0, 0)),
        })
      );
      this.collection.push(
        Object.assign({}, createNewUnitState(), {
          placement: createNewPlacementState(BOARD_TYPES.SORTIE_BOARD, createNewCoordinateState(0, 0)),
        })
      );
    });

    it('can find an unit', function() {
      assert.strictEqual(
        findUnitByPlacement(this.collection, this.collection[0].placement),
        this.collection[0]
      );
      assert.strictEqual(
        findUnitByPlacement(this.collection, this.collection[3].placement),
        this.collection[3]
      );
    });

    it('should return a first unit in the placement', function() {
      assert.strictEqual(
        findUnitByPlacement(this.collection, this.collection[2].placement),
        this.collection[0]
      );
    });

    it('should return null if it can not find an unit', function() {
      assert.strictEqual(
        findUnitByPlacement(createNewUnitCollectionState(), this.collection[2].placement),
        null
      );
    });
  });

  describe('findUnitByUid', () => {
    it('should be executed correctly', function() {
      const collection = createNewUnitCollectionState();
      collection.push(createNewUnitState());
      collection.push(createNewUnitState());

      assert.strictEqual(findUnitByUid(collection, collection[0].uid), collection[0]);
      assert.strictEqual(findUnitByUid(collection, collection[1].uid), collection[1]);
      assert.strictEqual(findUnitByUid(collection, 'uin_does_not_exist'), null);
    });
  });
});
