const assert = require('power-assert');

const {
  areSameSize2DArray,
  performPseudoVectorAddition,
} = require('../../src/lib/core');


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

  describe('performPseudoVectorAddition', () => {
    it('initialTop < terminaiTop', () => {
      assert.deepEqual(performPseudoVectorAddition(1, 0, 3, 0, 1), [2, 0]);
      assert.deepEqual(performPseudoVectorAddition(1, 0, 3, 0, 3), [3, 0]);
    });

    it('initialTop > terminaiTop', () => {
      assert.deepEqual(performPseudoVectorAddition(3, 0, 1, 0, 1), [2, 0]);
      assert.deepEqual(performPseudoVectorAddition(3, 0, 1, 0, 3), [3, 0]);
    });

    it('initialLeft < terminaiLeft', () => {
      assert.deepEqual(performPseudoVectorAddition(0, 1, 0, 3, 1), [0, 2]);
      assert.deepEqual(performPseudoVectorAddition(0, 1, 0, 3, 3), [0, 3]);
    });

    it('initialLeft > terminaiLeft', () => {
      assert.deepEqual(performPseudoVectorAddition(0, 3, 0, 1, 1), [0, 2]);
      assert.deepEqual(performPseudoVectorAddition(0, 3, 0, 1, 3), [0, 3]);
    });

    it('initialTop !== terminaiTop && initialLeft !== terminaiLeft', () => {
      assert.throws(() => {
        performPseudoVectorAddition(1, 2, 3, 4, 1);
      }, /move only/);
    });

    it('can perform float type numbers', () => {
      assert.deepEqual(performPseudoVectorAddition(1.1, 2.2, 10, 2.2, 1.1), [1.1 + 1.1, 2.2]);
      assert.deepEqual(performPseudoVectorAddition(1.1, 2.2, 1.1, 10, 1.1), [1.1, 2.2 + 1.1]);
    });
  });
});
