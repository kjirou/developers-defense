const assert = require('power-assert');

const {
  areSameCoordinates,
  createNewCoordinateState,
  tryToMoveCoordinate,
} = require('../../src/state-models/coordinate');


describe('state-models/coordinate', () => {
  describe('createNewCoordinateState', () => {
    it('can execute correctly', () => {
      assert.deepStrictEqual(createNewCoordinateState(0, 0), [0, 0]);
      assert.deepStrictEqual(createNewCoordinateState(1, 2), [1, 2]);
      assert.deepStrictEqual(createNewCoordinateState(99, 99), [99, 99]);

      assert.throws(() => {
        createNewCoordinateState(1.1, 2);
      }, /integers/);
      assert.throws(() => {
        createNewCoordinateState(1, 2.1);
      }, /integers/);

      assert.throws(() => {
        createNewCoordinateState(-1, 2);
      }, /negative/i);
      assert.throws(() => {
        createNewCoordinateState(1, -1);
      }, /negative/i);
    });
  });

  describe('areSameCoordinates', () => {
    it('can execute correctly', () => {
      const _c = createNewCoordinateState;

      assert(areSameCoordinates(_c(0, 0), _c(0, 0)));
      assert(areSameCoordinates(_c(1, 2), _c(1, 2), _c(1, 2)));

      assert(!areSameCoordinates(_c(1, 2), _c(1, 1)));
      assert(!areSameCoordinates(_c(1, 2), _c(2, 2)));
      assert(!areSameCoordinates(_c(1, 2), _c(1, 2), _c(2, 2)));
    });
  });

  describe('tryToMoveCoordinate', () => {
    it('can execute correctly', () => {
      const base = createNewCoordinateState(1, 2);

      assert.deepStrictEqual(tryToMoveCoordinate(base, 1, 2), createNewCoordinateState(2, 4));
      assert.strictEqual(tryToMoveCoordinate(base, 0.1, 2), null);
      assert.strictEqual(tryToMoveCoordinate(base, -2, 2), null);
    });
  });
});
