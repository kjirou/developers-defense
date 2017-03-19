const assert = require('power-assert');

const {
  addCoordinates,
  areSameCoordinates,
  createNewCoordinateState,
  isCoordinateInRange,
} = require('../../src/state-models/coordinate');


describe('state-models/coordinate', function() {
  const _c = createNewCoordinateState;

  describe('createNewCoordinateState', function() {
    it('can execute correctly', function() {
      assert.deepStrictEqual(createNewCoordinateState(0, 0), { rowIndex: 0, columnIndex: 0 });
      assert.deepStrictEqual(createNewCoordinateState(1, 2), { rowIndex: 1, columnIndex: 2 });

      assert.throws(() => {
        createNewCoordinateState(1.1, 2);
      }, /integers/);
      assert.throws(() => {
        createNewCoordinateState(1, 2.1);
      }, /integers/);
    });
  });

  describe('areSameCoordinates', function() {
    it('can execute correctly', function() {
      assert(areSameCoordinates(_c(0, 0), _c(0, 0)));
      assert(areSameCoordinates(_c(1, 2), _c(1, 2), _c(1, 2)));

      assert(!areSameCoordinates(_c(1, 2), _c(1, 1)));
      assert(!areSameCoordinates(_c(1, 2), _c(2, 2)));
      assert(!areSameCoordinates(_c(1, 2), _c(1, 2), _c(2, 2)));
    });
  });

  describe('addCoordinates', function() {
    it('can execute correctly', function() {
      assert.deepStrictEqual(addCoordinates(_c(0, 1), _c(2, 3)), _c(2, 4));
      assert.deepStrictEqual(addCoordinates(_c(0, 1), _c(2, 3), _c(4, 5)), _c(6, 9));
      assert.deepStrictEqual(addCoordinates(_c(0, 1), _c(-3, -2)), _c(-3, -1));
    });
  });

  describe('isCoordinateInRange', function() {
    it('can execute correctly', function() {
      assert.strictEqual(isCoordinateInRange(_c(0, 0), _c(0, 0), _c(0, 0)), true);
      assert.strictEqual(isCoordinateInRange(_c(0, 0), _c(1, 0), _c(0, 0)), false);
      assert.strictEqual(isCoordinateInRange(_c(0, 0), _c(0, 1), _c(0, 0)), false);
      assert.strictEqual(isCoordinateInRange(_c(0, 0), _c(0, 0), _c(-1, 0)), false);
      assert.strictEqual(isCoordinateInRange(_c(0, 0), _c(0, 0), _c(0, -1)), false);

      assert.strictEqual(isCoordinateInRange(_c(1, 2), _c(1, 2), _c(1, 2)), true);
      assert.strictEqual(isCoordinateInRange(_c(1, 2), _c(0, 1), _c(2, 3)), true);
    });
  });
});
