const assert = require('power-assert');

const {
  areSameSizeMatrices,
  performPseudoVectorAddition,
} = require('../../src/lib/core');


describe('lib/core', () => {
  describe('areSameSizeMatrices', () => {
    it('can check 2 matrices', () => {
      assert.strictEqual(areSameSizeMatrices(
        [
          [1, 1, 1],
          [1, 1, 1],
        ],
        [
          [1, 1, 1],
          [1, 1, 1],
        ]
      ), true);

      assert.strictEqual(areSameSizeMatrices(
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

      assert.strictEqual(areSameSizeMatrices(
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

      assert.strictEqual(areSameSizeMatrices(
        [
          [1, 1, 1],
          [1, 1, 1],
        ],
        [
          [1, 1, 1],
          [1, 1],
        ]
      ), false);

      assert.strictEqual(areSameSizeMatrices(
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

    it('can check 3 matrices', () => {
      assert.strictEqual(areSameSizeMatrices(
        [
          [1, 1],
          [1, 1],
        ],
        [
          [1, 1],
          [1, 1],
        ],
        [
          [1, 1],
          [1, 1],
        ]
      ), true);

      assert.strictEqual(areSameSizeMatrices(
        [
          [1, 1],
          [1, 1],
        ],
        [
          [1, 1],
          [1, 1],
        ],
        [
          [1, 1],
        ]
      ), false);

      assert.strictEqual(areSameSizeMatrices(
        [
          [1, 1],
          [1, 1],
        ],
        [
          [1, 1],
          [1, 1],
        ],
        [
          [1, 1],
          [1, 1, 1],
        ]
      ), false);
    });
  });
});
