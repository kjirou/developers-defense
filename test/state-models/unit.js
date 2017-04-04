const assert = require('power-assert');

const { FACTION_TYPES } = require('../../src/immutable/constants');
const locationMethods = require('../../src/state-models/location');
const {
  calculateActionPointsRecovery,
  calculateDamage,
  calculateDamageByRate,
  calculateEnemyMoveResults,
  calculateHealing,
  calculateHealingByRate,
  calculateMovableDistance,
  createNewAllyState,
  createNewEnemyState,
  createNewUnitState,
  determineFriendship,
  getMaxHitPoints,
  getHitPointsRate,
  isAlive,
  isDead,
  isFullHitPoints,
} = require('../../src/state-models/unit');


describe('state-models/unit', function() {
  let unit;

  beforeEach(function() {
    unit = createNewUnitState();
  });

  describe('calculateEnemyMoveResults', function() {
    it('should throw a error if destinations does not exist', function() {
      unit.destinations = [];

      assert.throws(() => {
        calculateEnemyMoveResults(unit);
      }, /not move/);
    });

    it('can walk destinations', function() {
      unit.destinations = [
        locationMethods.createNewLocationState(1, 2),
        locationMethods.createNewLocationState(2, 2),
        locationMethods.createNewLocationState(2, 3),
      ];
      unit.movePointsRecovery = 11;

      assert.strictEqual(unit.location, null);
      assert.strictEqual(unit.destinationIndex, 0);

      Object.assign(unit, calculateEnemyMoveResults(unit));
      assert.deepStrictEqual(unit.location, locationMethods.createNewLocationState(1, 2));
      assert.strictEqual(unit.movePoints, 0);
      assert.strictEqual(unit.destinationIndex, 1);

      Object.assign(unit, calculateEnemyMoveResults(unit));
      assert.deepStrictEqual(unit.location, locationMethods.createNewLocationState(1, 2));
      assert.strictEqual(unit.movePoints, 55);
      assert.strictEqual(unit.destinationIndex, 1);

      Object.assign(unit, calculateEnemyMoveResults(unit));
      assert.deepStrictEqual(unit.location, locationMethods.createNewLocationState(2, 2));
      assert.strictEqual(unit.movePoints, 0);
      assert.strictEqual(unit.destinationIndex, 2);

      Object.assign(unit, calculateEnemyMoveResults(unit));
      assert.deepStrictEqual(unit.location, locationMethods.createNewLocationState(2, 2));
      assert.strictEqual(unit.movePoints, 55);
      assert.strictEqual(unit.destinationIndex, 2);

      Object.assign(unit, calculateEnemyMoveResults(unit));
      assert.deepStrictEqual(unit.location, locationMethods.createNewLocationState(2, 3));
      assert.strictEqual(unit.movePoints, 0);
      assert.strictEqual(unit.destinationIndex, 3);

      Object.assign(unit, calculateEnemyMoveResults(unit));
      assert.deepStrictEqual(unit.location, locationMethods.createNewLocationState(2, 3));
      assert.strictEqual(unit.movePoints, 0);
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

  describe('parameters', function() {
    it('getMaxHitPoints', function() {
      assert(getMaxHitPoints(unit) > 0);

      unit.fixedMaxHitPoints = 5;
      assert.strictEqual(getMaxHitPoints(unit), 5);
    });

    it('getHitPointsRate', function() {
      unit.fixedMaxHitPoints = 10;

      unit.hitPoints = 10;
      assert.strictEqual(getHitPointsRate(unit), 1.0);

      unit.hitPoints = 11;
      assert.strictEqual(getHitPointsRate(unit), 1.0);

      unit.hitPoints = 0;
      assert.strictEqual(getHitPointsRate(unit), 0.0);

      unit.hitPoints = -1;
      assert.strictEqual(getHitPointsRate(unit), 0.0);
    });

    it('calculateHealing', () => {
      unit.fixedMaxHitPoints = 10;
      unit.hitPoints = 1;

      assert.deepStrictEqual(calculateHealing(unit, 0), {
        hitPoints: 1,
        healingPoints: 0,
      });

      assert.deepStrictEqual(calculateHealing(unit, -1), {
        hitPoints: 1,
        healingPoints: 0,
      });

      assert.deepStrictEqual(calculateHealing(unit, 1), {
        hitPoints: 2,
        healingPoints: 1,
      });

      assert.deepStrictEqual(calculateHealing(unit, 9), {
        hitPoints: 10,
        healingPoints: 9,
      });

      assert.deepStrictEqual(calculateHealing(unit, 10), {
        hitPoints: 10,
        healingPoints: 10,
      });
    });

    it('calculateHealingByRate', () => {
      unit.fixedMaxHitPoints = 10;
      unit.hitPoints = 1;

      assert.deepStrictEqual(calculateHealingByRate(unit, 0.0), {
        hitPoints: 1,
        healingPoints: 0,
      });

      assert.deepStrictEqual(calculateHealingByRate(unit, -1.0), {
        hitPoints: 1,
        healingPoints: 0,
      });

      assert.deepStrictEqual(calculateHealingByRate(unit, 0.1), {
        hitPoints: 2,
        healingPoints: 1,
      });

      assert.deepStrictEqual(calculateHealingByRate(unit, 1.0), {
        hitPoints: 10,
        healingPoints: 10,
      });

      assert.deepStrictEqual(calculateHealingByRate(unit, 2.0), {
        hitPoints: 10,
        healingPoints: 20,
      });
    });

    it('calculateDamage', () => {
      unit.fixedMaxHitPoints = 10;
      unit.hitPoints = 10;

      assert.deepStrictEqual(calculateDamage(unit, 0), {
        hitPoints: 10,
        damagePoints: 0,
      });

      assert.deepStrictEqual(calculateDamage(unit, -1), {
        hitPoints: 10,
        damagePoints: 0,
      });

      assert.deepStrictEqual(calculateDamage(unit, 1), {
        hitPoints: 9,
        damagePoints: 1,
      });

      assert.deepStrictEqual(calculateDamage(unit, 10), {
        hitPoints: 0,
        damagePoints: 10,
      });

      assert.deepStrictEqual(calculateDamage(unit, 11), {
        hitPoints: 0,
        damagePoints: 11,
      });
    });

    it('calculateDamageByRate', () => {
      unit.fixedMaxHitPoints = 10;
      unit.hitPoints = 10;

      assert.deepStrictEqual(calculateDamageByRate(unit, 0.0), {
        hitPoints: 10,
        damagePoints: 0,
      });

      assert.deepStrictEqual(calculateDamageByRate(unit, -1.0), {
        hitPoints: 10,
        damagePoints: 0,
      });

      assert.deepStrictEqual(calculateDamageByRate(unit, 0.1), {
        hitPoints: 9,
        damagePoints: 1,
      });

      assert.deepStrictEqual(calculateDamageByRate(unit, 1.0), {
        hitPoints: 0,
        damagePoints: 10,
      });

      assert.deepStrictEqual(calculateDamageByRate(unit, 2.0), {
        hitPoints: 0,
        damagePoints: 20,
      });
    });

    it('isFullHitPoints', () => {
      unit.fixedMaxHitPoints = 10;
      unit.hitPoints = 10;
      assert.strictEqual(isFullHitPoints(unit), true);

      unit.hitPoints = 9;
      assert.strictEqual(isFullHitPoints(unit), false);
    });

    it('isDead / isAlive', () => {
      unit.fixedMaxHitPoints = 10;
      unit.hitPoints = 0;
      assert.strictEqual(isDead(unit), true);
      assert.strictEqual(isAlive(unit), false);

      unit.hitPoints = 1;
      assert.strictEqual(isDead(unit), false);
      assert.strictEqual(isAlive(unit), true);
    });

    it('calculateMovableDistance', function() {
      unit.movePoints = 0;
      assert.strictEqual(calculateMovableDistance(unit), 0);

      unit.movePoints = 99;
      assert.strictEqual(calculateMovableDistance(unit), 0);

      unit.movePoints = 100;
      assert.strictEqual(calculateMovableDistance(unit), 1);

      unit.movePoints = 101;
      assert.strictEqual(calculateMovableDistance(unit), 1);
    });
  });
});
