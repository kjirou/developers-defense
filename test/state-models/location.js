const assert = require('power-assert');

const {
  addLocations,
  areSameLocations,
  calculateCenterOfSquare,
  createNewLocationState,
  measureAngleAsEffectDirection,
  measureAngleWithTopAsZero,
  measureDistance,
  performPseudoVectorAddition,
} = require('../../src/state-models/location');


describe('state-models/location', () => {
  const _loc = createNewLocationState;

  describe('addLocations', () => {
    it('can execute correctly', () => {
      assert.deepStrictEqual(addLocations(_loc(0, 0), _loc(0, 0)), _loc(0, 0));
      assert.deepStrictEqual(addLocations(_loc(1, 0), _loc(0, 1)), _loc(1, 1));
      assert.deepStrictEqual(addLocations(_loc(0, 1), _loc(1, 0), _loc(1, 2)), _loc(2, 3));
      assert.deepStrictEqual(addLocations(_loc(10, 10), _loc(-1, -2)), _loc(9, 8));
    });
  });

  describe('calculateCenterOfSquare', () => {
    it('can execute correctly', () => {
      assert.deepStrictEqual(calculateCenterOfSquare(_loc(0, 48)), _loc(24, 72));
    });
  });

  describe('areSameLocations', () => {
    it('can execute correctly', () => {
      assert.strictEqual(areSameLocations(_loc(0, 0), _loc(0, 0)), true);
      assert.strictEqual(areSameLocations(_loc(1, 0), _loc(0, 0)), false);
      assert.strictEqual(areSameLocations(_loc(1, 1), _loc(1, 1), _loc(1, 1)), true);
      assert.strictEqual(areSameLocations(_loc(1, 1), _loc(1, 1), _loc(1, 2)), false);
    });
  });

  describe('measureDistance', () => {
    it('can execute correctly', () => {
      const a = createNewLocationState(0, 0);
      const b = createNewLocationState(0, 0);

      assert.deepStrictEqual(measureDistance(createNewLocationState(0, 0), createNewLocationState(0, 0)), 0);
      assert.deepStrictEqual(measureDistance(createNewLocationState(0, 1), createNewLocationState(0, 0)), 1);
      assert.deepStrictEqual(measureDistance(createNewLocationState(0, 0), createNewLocationState(-1, 0)), 1);
    });
  });

  describe('measureAngleWithTopAsZero', () => {
    it('can execute correctly', () => {
      const times = [
        [[0, 0], [-1, 0], 0],
        [[0, 0], [-1, 1], 45],
        [[0, 0], [0, 1], 90],
        [[0, 0], [1, 1], 135],
        [[0, 0], [1, 0], 180],
        [[0, 0], [1, -1], 225],
        [[0, 0], [0, -1], 270],
        [[0, 0], [-1, -1], 315],
      ].map(([fromArgs, toArgs, expectedRoundedAngle]) => {
        assert.strictEqual(
          Math.round(
            measureAngleWithTopAsZero(_loc(...fromArgs), _loc(...toArgs))
          ),
          expectedRoundedAngle,
          `from=[${ fromArgs }], to=[${ toArgs }] -> ${ expectedRoundedAngle }`
        );
      }).length;

      assert(times > 0);
    });

    it('should return null if two points are same locations', () => {
      assert.strictEqual(measureAngleWithTopAsZero(_loc(0, 0), _loc(0, 0)), null);
      assert.strictEqual(measureAngleWithTopAsZero(_loc(1.2, 3.4), _loc(1.2, 3.4)), null);
    });
  });

  describe('measureAngleWithTopAsZero', () => {
    it('can execute correctly', () => {
      const from = createNewLocationState(0, 0);
      assert.strictEqual(measureAngleAsEffectDirection(from, createNewLocationState(-1, 0)), 'UP');
      assert.strictEqual(measureAngleAsEffectDirection(from, createNewLocationState(0, 1)), 'RIGHT');
      assert.strictEqual(measureAngleAsEffectDirection(from, createNewLocationState(1, 0)), 'DOWN');
      assert.strictEqual(measureAngleAsEffectDirection(from, createNewLocationState(0, -1)), 'LEFT');
      assert.strictEqual(measureAngleAsEffectDirection(from, createNewLocationState(0, 0)), 'NONE');
    });
  });

  describe('performPseudoVectorAddition', () => {
    it('initial.y < terminal.y', () => {
      assert.deepEqual(
        performPseudoVectorAddition(createNewLocationState(1, 0), createNewLocationState(3, 0), 1),
        createNewLocationState(2, 0)
      );
      assert.deepEqual(
        performPseudoVectorAddition(createNewLocationState(1, 0), createNewLocationState(3, 0), 3),
        createNewLocationState(3, 0)
      );
    });

    it('initial.y > terminal.y', () => {
      assert.deepEqual(
        performPseudoVectorAddition(createNewLocationState(3, 0), createNewLocationState(1, 0), 1),
        createNewLocationState(2, 0)
      );
      assert.deepEqual(
        performPseudoVectorAddition(createNewLocationState(3, 0), createNewLocationState(1, 0), 3),
        createNewLocationState(1, 0)
      );
    });

    it('initial.x < terminal.x', () => {
      assert.deepEqual(
        performPseudoVectorAddition(createNewLocationState(0, 1), createNewLocationState(0, 3), 1),
        createNewLocationState(0, 2)
      );
      assert.deepEqual(
        performPseudoVectorAddition(createNewLocationState(0, 1), createNewLocationState(0, 3), 3),
        createNewLocationState(0, 3)
      );
    });

    it('initial.x > terminal.x', () => {
      assert.deepEqual(
        performPseudoVectorAddition(createNewLocationState(0, 3), createNewLocationState(0, 1), 1),
        createNewLocationState(0, 2)
      );
      assert.deepEqual(
        performPseudoVectorAddition(createNewLocationState(0, 3), createNewLocationState(0, 1), 3),
        createNewLocationState(0, 1)
      );
    });

    it('should throw a error if it is `initial.y !== terminai.y && initial.x !== terminai.x`', () => {
      assert.throws(() => {
        performPseudoVectorAddition(createNewLocationState(1, 2), createNewLocationState(3, 4), 1);
      }, /move only/);
    });

    it('can perform to float type numbers', () => {
      assert.deepEqual(
        performPseudoVectorAddition(createNewLocationState(1.1, 99.9), createNewLocationState(99.9, 99.9), 2.2),
        createNewLocationState(1.1 + 2.2, 99.9)
      );
      assert.deepEqual(
        performPseudoVectorAddition(createNewLocationState(99.9, 1.1), createNewLocationState(99.9, 99.9), 2.2),
        createNewLocationState(99.9, 1.1 + 2.2)
      );
    });
  });
});
