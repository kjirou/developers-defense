const assert = require('power-assert');

const {
  createNewUnitState,
  calculateMovementResults,
} = require('../../src/state-models/unit');


describe('state-models/unit', () => {
  let unit;

  beforeEach(() => {
    unit = createNewUnitState();
  });

  describe('calculateMovementResults', () => {
    it('should throw a error if destinations does not exist', () => {
      unit.destinations = [];

      assert.throws(() => {
        calculateMovementResults(unit);
      }, /not move/);
    });

    it('can move', () => {
      unit.destinations = [[1, 2], [2, 2], [2, 3]];
      unit.movingSpeed = 99;

      assert.strictEqual(unit.location, null);
      assert.strictEqual(unit.destinationIndex, 0);

      Object.assign(unit, calculateMovementResults(unit));
      assert.deepStrictEqual(unit.location, [1, 2]);
      assert.strictEqual(unit.destinationIndex, 1);

      Object.assign(unit, calculateMovementResults(unit));
      assert.deepStrictEqual(unit.location, [2, 2]);
      assert.strictEqual(unit.destinationIndex, 2);

      Object.assign(unit, calculateMovementResults(unit));
      assert.deepStrictEqual(unit.location, [2, 3]);
      assert.strictEqual(unit.destinationIndex, 3);

      Object.assign(unit, calculateMovementResults(unit));
      assert.deepStrictEqual(unit.location, [2, 3]);
      assert.strictEqual(unit.destinationIndex, 3);
    });
  });
});
