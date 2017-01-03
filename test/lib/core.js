const assert = require('power-assert');

const {
  areSameSizeMatrices,
  performPseudoVectorAddition,
  matrixAdd,
  underscoredToClassName,
} = require('../../src/lib/core');


describe('lib/core', () => {
  describe('toClassName', () => {
    it('can execute correctly', () => {
      assert.strictEqual(underscoredToClassName('abc'), 'Abc');
      assert.strictEqual(underscoredToClassName('abc_def'), 'AbcDef');
      assert.strictEqual(underscoredToClassName('ABC'), 'Abc');
      assert.strictEqual(underscoredToClassName('ABC_DEF'), 'AbcDef');
    });
  });

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

  describe('matrixAdd', () => {
    it('can add 2 matrices', () => {
      assert.deepStrictEqual(
        matrixAdd(
          [
            [0, 1],
            [2, 3],
          ],
          [
            [10, 11],
            [12, 13],
          ]
        ),
        [
          [10, 12],
          [14, 16],
        ]
      );

      assert.deepStrictEqual(
        matrixAdd(
          [
            [10, 11],
            [12, 13],
          ],
          [
            [-1, -2],
            [-3, -4],
          ]
        ),
        [
          [9, 9],
          [9, 9],
        ]
      );
    });

    it('can add 3 matrices', () => {
      assert.deepStrictEqual(
        matrixAdd(
          [
            [0, 1],
            [2, 3],
          ],
          [
            [0, 1],
            [2, 3],
          ],
          [
            [0, 1],
            [2, 3],
          ]
        ),
        [
          [0, 3],
          [6, 9],
        ]
      );
    });
  });
});
