const assert = require('power-assert');

const {
  _expandDistanceToRelativeCoordinatesWithoutMemoization,
  _expandDistanceToRelativeCoordinates,
  _partitionIntegerToTwoParts,
  areSameSizeMatrices,
  expandReachToRelativeCoordinates,
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

  describe('_partitionIntegerToTwoParts', () => {
    it('can partition 0', () => {
      assert.deepStrictEqual(_partitionIntegerToTwoParts(0), [
        [0, 0],
      ]);
    });

    it('can partition 4', () => {
      assert.deepStrictEqual(_partitionIntegerToTwoParts(4), [
        [4, 0],
        [3, 1],
        [2, 2],
        [1, 3],
        [0, 4],
      ]);
    });
  });

  describe('_expandDistanceToRelativeCoordinatesWithoutMemoization', () => {
    it('can expand 0', () => {
      assert.deepStrictEqual(
        _expandDistanceToRelativeCoordinatesWithoutMemoization(0),
        [
          [0, 0],
        ]
      );
    });

    it('can expand 1', () => {
      assert.deepStrictEqual(
        _expandDistanceToRelativeCoordinatesWithoutMemoization(1),
        [
          [-1, 0],
          [0, 1],
          [1, 0],
          [0, -1],
        ]
      );
    });

    it('can expand 2', () => {
      assert.deepStrictEqual(
        _expandDistanceToRelativeCoordinatesWithoutMemoization(2),
        [
          [-2, 0],
          [-1, 1],
          [0, 2],
          [1, 1],
          [2, 0],
          [1, -1],
          [0, -2],
          [-1, -1],
        ]
      );
    });

    it('can expand 3', () => {
      assert.deepStrictEqual(
        _expandDistanceToRelativeCoordinatesWithoutMemoization(3),
        [
          [-3, 0],
          [-2, 1],
          [-1, 2],
          [0, 3],
          [1, 2],
          [2, 1],
          [3, 0],
          [2, -1],
          [1, -2],
          [0, -3],
          [-1, -2],
          [-2, -1],
        ]
      );
    });

    it('can expand 4', () => {
      assert.deepStrictEqual(
        _expandDistanceToRelativeCoordinatesWithoutMemoization(4),
        [
          [-4, 0],
          [-3, 1],
          [-2, 2],
          [-1, 3],
          [0, 4],
          [1, 3],
          [2, 2],
          [3, 1],
          [4, 0],
          [3, -1],
          [2, -2],
          [1, -3],
          [0, -4],
          [-1, -3],
          [-2, -2],
          [-3, -1],
        ]
      );
    });
  });

  describe('_expandDistanceToRelativeCoordinates', () => {
    it('can expand 2 by using cache', () => {
      const result1 = _expandDistanceToRelativeCoordinates(2);
      const result2 = _expandDistanceToRelativeCoordinates(2);

      assert.strictEqual(result1, result2);
      assert.deepStrictEqual(
        result1,
        [
          [-2, 0],
          [-1, 1],
          [0, 2],
          [1, 1],
          [2, 0],
          [1, -1],
          [0, -2],
          [-1, -1],
        ]
      );
    });
  });

  describe('expandReachToRelativeCoordinates', () => {
    it('can expand from 0 to 0', () => {
      assert.deepStrictEqual(
        expandReachToRelativeCoordinates(0, 0),
        [
          [0, 0],
        ]
      );
    });

    it('can expand from 0 to 1', () => {
      assert.deepStrictEqual(
        expandReachToRelativeCoordinates(0, 1),
        [
          [0, 0],
          [-1, 0],
          [0, 1],
          [1, 0],
          [0, -1],
        ]
      );
    });

    it('can expand from 1 to 1', () => {
      assert.deepStrictEqual(
        expandReachToRelativeCoordinates(1, 1),
        [
          [-1, 0],
          [0, 1],
          [1, 0],
          [0, -1],
        ]
      );
    });
  });
});
