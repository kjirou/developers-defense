const assert = require('power-assert');

const {
  createNewBulletState,
  calculateNextLocation,
} = require('../../src/state-models/bullet');
const { createNewLocationState } = require('../../src/state-models/location');


describe('state-models/bullet', () => {
  const _loc = createNewLocationState;

  const _createNoneEffect = () => {
    // TODO
    return {};
  };

  describe('calculateNextLocation', () => {
    it('can calculate next location in the right direction', () => {
      const bullet = createNewBulletState(_loc(0, 1), _loc(0, 10), 5, _createNoneEffect());
      const result = calculateNextLocation(bullet);
      assert.deepStrictEqual(result, _loc(0, 6));
    });

    it('can calculate next location in the left direction', () => {
      const bullet = createNewBulletState(_loc(0, 15), _loc(0, 0), 5, _createNoneEffect());
      const result = calculateNextLocation(bullet);
      assert.deepStrictEqual(result, _loc(0, 10));
    });

    it('can calculate next location in the bottom direction', () => {
      const bullet = createNewBulletState(_loc(1, 0), _loc(10, 0), 5, _createNoneEffect());
      const result = calculateNextLocation(bullet);
      assert.deepStrictEqual(result, _loc(6, 0));
    });

    it('can calculate next location in the top direction', () => {
      const bullet = createNewBulletState(_loc(10, 0), _loc(0, 0), 5, _createNoneEffect());
      const result = calculateNextLocation(bullet);
      assert.deepStrictEqual(result, _loc(5, 0));
    });

    it('can calculate next location in the bottom/right direction', () => {
      const bullet = createNewBulletState(_loc(2, 4), _loc(10, 10), 5, _createNoneEffect());
      const result = calculateNextLocation(bullet);
      assert.deepStrictEqual(result, _loc(6, 7));
    });

    it('can calculate next location in the top/left direction', () => {
      const bullet = createNewBulletState(_loc(10, 10), _loc(2, 4), 5, _createNoneEffect());
      const result = calculateNextLocation(bullet);
      assert.deepStrictEqual(result, _loc(6, 7));
    });

    it('should not pass the destionation', () => {
      const bullet1 = createNewBulletState(_loc(2, 4), _loc(10, 10), 10, _createNoneEffect());
      const bullet2 = createNewBulletState(_loc(2, 4), _loc(10, 10), 12, _createNoneEffect());
      const result1 = calculateNextLocation(bullet1);
      const result2 = calculateNextLocation(bullet2);
      assert.deepStrictEqual(result1, _loc(10, 10));
      assert.deepStrictEqual(result2, _loc(10, 10));
    });
  });
});
