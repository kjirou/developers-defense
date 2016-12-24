const assert = require('power-assert');

const {
  createNewSquareMatrixState,
  findSquareByCoordinate,
  findSquareByUid,
  parseMapText,
} = require('../../src/state-models/square-matrix');


describe('state-models/square-matrix', () => {
  describe('findSquareByCoordinate', () => {
    it('should be executed correctly', () => {
      const matrix = createNewSquareMatrixState(2, 3);
      assert.strictEqual(findSquareByCoordinate(matrix, [0, 0]), matrix[0][0]);
      assert.strictEqual(findSquareByCoordinate(matrix, [1, 2]), matrix[1][2]);
      assert.strictEqual(findSquareByCoordinate(matrix, [2, 2]), null);
      assert.strictEqual(findSquareByCoordinate(matrix, [1, 3]), null);
    });
  });

  describe('findSquareByUid', () => {
    it('should be executed correctly', () => {
      const matrix = createNewSquareMatrixState(2, 3);
      assert.strictEqual(findSquareByUid(matrix, matrix[0][0].uid), matrix[0][0]);
      assert.strictEqual(findSquareByUid(matrix, matrix[1][2].uid), matrix[1][2]);
      assert.strictEqual(findSquareByUid(matrix, ''), null);
    });
  });

  describe('parseMapText', () => {
    it('should parse a text that means a map', () => {
      const mapText = [
        '. ',
        'FC',
      ].join('\n');
      assert.deepStrictEqual(parseMapText(mapText), [
        [{ landformType: 'GRASSFIELD' }, { landformType: 'ROAD' }],
        [{ landformType: 'FORT' }, { landformType: 'CASTLE' }],
      ]);
    });

    it('should throw a error if the map-text includes an undefined symbol', () => {
      const mapText = [
        '. ',
        'FZ',
      ].join('\n');
      assert.throws(() => {
        parseMapText(mapText);
      }, /Z/);
    });
  });
});
