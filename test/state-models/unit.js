const assert = require('power-assert');

const { FACTION_TYPES } = require('../../src/immutable/constants');
const locationMethods = require('../../src/state-models/location');
const {
  calculateActionPointsRecovery,
  calculateMovementResults,
  createNewAllyState,
  createNewEnemyState,
  createNewUnitState,
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
      unit.destinations = [
        locationMethods.createNewLocationState(1, 2),
        locationMethods.createNewLocationState(2, 2),
        locationMethods.createNewLocationState(2, 3),
      ];
      unit.movingSpeed = 99;

      assert.strictEqual(unit.location, null);
      assert.strictEqual(unit.destinationIndex, 0);

      Object.assign(unit, calculateMovementResults(unit));
      assert.deepStrictEqual(unit.location, locationMethods.createNewLocationState(1, 2));
      assert.strictEqual(unit.destinationIndex, 1);

      Object.assign(unit, calculateMovementResults(unit));
      assert.deepStrictEqual(unit.location, locationMethods.createNewLocationState(2, 2));
      assert.strictEqual(unit.destinationIndex, 2);

      Object.assign(unit, calculateMovementResults(unit));
      assert.deepStrictEqual(unit.location, locationMethods.createNewLocationState(2, 3));
      assert.strictEqual(unit.destinationIndex, 3);

      Object.assign(unit, calculateMovementResults(unit));
      assert.deepStrictEqual(unit.location, locationMethods.createNewLocationState(2, 3));
      assert.strictEqual(unit.destinationIndex, 3);
    });
  });

  describe('determineFriendship', () => {
    it('can execute correctly', () => {
      const ally = createNewAllyState();
      const enemy = createNewEnemyState();

      assert.strictEqual(determineFriendship(ally, ally), 'FRIENDLY');
      assert.strictEqual(determineFriendship(enemy, enemy), 'FRIENDLY');
      assert.strictEqual(determineFriendship(ally, enemy), 'UNFRIENDLY');
      assert.strictEqual(determineFriendship(enemy, ally), 'UNFRIENDLY');
    });
  });

  describe('calculateActionPointsRecovery', () => {
    it('can execute correctly', () => {
      assert.strictEqual(
        calculateActionPointsRecovery(
          Object.assign(createNewUnitState(), { actionPoints: 0, actionPointsRecovery: 3, maxActionPoints: 10 })
        ),
        3
      );

      assert.strictEqual(
        calculateActionPointsRecovery(
          Object.assign(createNewUnitState(), { actionPoints: 3, actionPointsRecovery: 3, maxActionPoints: 10 })
        ),
        6
      );

      assert.strictEqual(
        calculateActionPointsRecovery(
          Object.assign(createNewUnitState(), { actionPoints: 8, actionPointsRecovery: 3, maxActionPoints: 10 })
        ),
        10
      );
    });
  });
});
