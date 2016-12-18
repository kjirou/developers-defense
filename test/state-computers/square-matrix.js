const assert = require('power-assert');

const {
  createInitialSquareMatrixState,
  findSquareByCoordinate,
} = require('../../src/state-computers/square-matrix');


describe('state-computers/square-matrix', () => {
  describe('findSquareByCoordinate', () => {
    it('should be executed correctly', () => {
      const matrix = createInitialSquareMatrixState(2, 3);
      assert.strictEqual(findSquareByCoordinate(matrix, [0, 0]), matrix[0][0]);
      assert.strictEqual(findSquareByCoordinate(matrix, [1, 2]), matrix[1][2]);
      assert.strictEqual(findSquareByCoordinate(matrix, [2, 2]), null);
      assert.strictEqual(findSquareByCoordinate(matrix, [1, 3]), null);
    });
  });
});