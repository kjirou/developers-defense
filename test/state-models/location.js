const assert = require('power-assert');

const {
  createNewLocationState,
  measureDistance,
  performPseudoVectorAddition,
} = require('../../src/state-models/location');


describe('state-models/location', () => {
  describe('measureDistance', () => {
    it('can execute correctly', () => {
      const a = createNewLocationState(0, 0);
      const b = createNewLocationState(0, 0);

      assert.deepStrictEqual(measureDistance(createNewLocationState(0, 0), createNewLocationState(0, 0)), 0);
      assert.deepStrictEqual(measureDistance(createNewLocationState(0, 1), createNewLocationState(0, 0)), 1);
      assert.deepStrictEqual(measureDistance(createNewLocationState(0, 0), createNewLocationState(-1, 0)), 1);
    });
  });

  describe('performPseudoVectorAddition', () => {
    it('initialTop < terminaiTop', () => {
      assert.deepEqual(performPseudoVectorAddition([1, 0], [3, 0], 1), [2, 0]);
      assert.deepEqual(performPseudoVectorAddition([1, 0], [3, 0], 3), [3, 0]);
    });

    it('initialTop > terminaiTop', () => {
      assert.deepEqual(performPseudoVectorAddition([3, 0], [1, 0], 1), [2, 0]);
      assert.deepEqual(performPseudoVectorAddition([3, 0], [1, 0], 3), [1, 0]);
    });

    it('initialLeft < terminaiLeft', () => {
      assert.deepEqual(performPseudoVectorAddition([0, 1], [0, 3], 1), [0, 2]);
      assert.deepEqual(performPseudoVectorAddition([0, 1], [0, 3], 3), [0, 3]);
    });

    it('initialLeft > terminaiLeft', () => {
      assert.deepEqual(performPseudoVectorAddition([0, 3], [0, 1], 1), [0, 2]);
      assert.deepEqual(performPseudoVectorAddition([0, 3], [0, 1], 3), [0, 1]);
    });

    it('initialTop !== terminaiTop && initialLeft !== terminaiLeft', () => {
      assert.throws(() => {
        performPseudoVectorAddition([1, 2], [3, 4], 1);
      }, /move only/);
    });

    it('can perform float type numbers', () => {
      assert.deepEqual(performPseudoVectorAddition([1.1, 2.2], [10, 2.2], 1.1), [1.1 + 1.1, 2.2]);
      assert.deepEqual(performPseudoVectorAddition([1.1, 2.2], [1.1, 10], 1.1), [1.1, 2.2 + 1.1]);
    });
  });
});
