const assert = require('power-assert');

const { LANDFORM_TYPES, PARAMETERS } = require('../../src/immutable/constants');
const {
  _createInitialState,
  parseMapText,
  reduceBattleSquareMatrix,
} = require('../../src/reducers/battle-square-matrix');
const { findSquareByCoordinate } = require('../../src/state-computers/square-matrix');


describe('reducers/battle-square-matrix', () => {
  describe('initialState', () => {
    it('should be set at first', () => {
      const state = reduceBattleSquareMatrix(undefined, { type: 'NOOP' });
      assert.strictEqual(Array.isArray(state), true);
    });

    it('should initialize coordinate properties', () => {
      const state = reduceBattleSquareMatrix(undefined, { type: 'NOOP' });

      for (let rowIndex = 0; rowIndex < state.length; rowIndex += 1) {
        const rowSquares = state[rowIndex];
        for (let columnIndex = 0; columnIndex < rowSquares.length; columnIndex += 1) {
          const square = state[rowIndex][columnIndex];
          assert.deepStrictEqual([rowIndex, columnIndex], square.coordinate);
        }
      }
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

  describe('UPDATE_ALL_SQUARES', () => {
    let state;

    const _createUpdates = (properties) => {
      return Array.from({ length: PARAMETERS.BATTLE_BOARD_ROW_LENGTH }).map(() => {
        return Array.from({ length: PARAMETERS.BATTLE_BOARD_COLUMN_LENGTH }).map(() => {
          return Object.assign({}, properties);;
        });
      });
    };

    beforeEach(() => {
      state = _createInitialState();
    });

    it('can extend all squares', () => {
      assert.strictEqual(findSquareByCoordinate(state, [0, 0]).landformType, null);
      assert.strictEqual(findSquareByCoordinate(state, [1, 1]).landformType, null);

      const updates = _createUpdates({ landformType: LANDFORM_TYPES.ROAD });
      state = reduceBattleSquareMatrix(state, { type: 'UPDATE_ALL_SQUARES', updates });

      assert.strictEqual(findSquareByCoordinate(state, [0, 0]).landformType, 'ROAD');
      assert.strictEqual(findSquareByCoordinate(state, [1, 1]).landformType, 'ROAD');
    });

    it('should throw a error if the squares and the updates are not the same size', () => {
      const updates = _createUpdates({ landformType: LANDFORM_TYPES.ROAD });
      updates.push({});
      assert.throws(() => {
        reduceBattleSquareMatrix(state, { type: 'UPDATE_ALL_SQUARES', updates });
      }, /same size/);
    });

    it('should throw a error if a updator includes undefined key', () => {
      const updates = _createUpdates();
      updates[0][0].notDefinedKey = 1;
      assert.throws(() => {
        reduceBattleSquareMatrix(state, { type: 'UPDATE_ALL_SQUARES', updates });
      }, /notDefinedKey/);
    });
  });
});
