const assert = require('power-assert');

const { areSameSize2DArray } = require('../../src/lib/core');


describe('lib/core', () => {
  describe('areSameSize2DArray', () => {
    it('should be executed as expected', () => {
      assert.strictEqual(areSameSize2DArray(
        [
          [1, 1, 1],
          [1, 1, 1],
        ],
        [
          [1, 1, 1],
          [1, 1, 1],
        ]
      ), true);

      assert.strictEqual(areSameSize2DArray(
        [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
        [
          [1, 1, 1],
          [1, 1, 1],
        ]
      ), false);

      assert.strictEqual(areSameSize2DArray(
        [
          [1, 1, 1],
          [1, 1, 1],
        ],
        [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ]
      ), false);

      assert.strictEqual(areSameSize2DArray(
        [
          [1, 1, 1],
          [1, 1, 1],
        ],
        [
          [1, 1, 1],
          [1, 1],
        ]
      ), false);

      assert.strictEqual(areSameSize2DArray(
        [
          [1, 1, 1],
          [1, 1],
        ],
        [
          [1, 1, 1],
          [1, 1, 1],
        ]
      ), false);
    });
  });
});
