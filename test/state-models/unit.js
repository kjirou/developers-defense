const assert = require('power-assert');

const { FACTION_TYPES } = require('../../src/immutable/constants');
const {
  createNewUnitState,
  calculateMovementResults,
  determineFriendship,
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

  describe('determineFriendship', () => {
    it('can execute correctly', () => {
      const ally = createNewUnitState();
      ally.factionType = FACTION_TYPES.ALLY;

      const enemy = createNewUnitState();
      enemy.factionType = FACTION_TYPES.ENEMY;

      assert.strictEqual(determineFriendship(ally, ally), 'FRIENDLY');
      assert.strictEqual(determineFriendship(enemy, enemy), 'FRIENDLY');
      assert.strictEqual(determineFriendship(ally, enemy), 'UNFRIENDLY');
      assert.strictEqual(determineFriendship(enemy, ally), 'UNFRIENDLY');
    });
  });
});
