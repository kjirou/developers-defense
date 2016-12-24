const assert = require('power-assert');

const { ACTION_TYPES, LANDFORM_TYPES, PARAMETERS } = require('../../src/immutable/constants');
const {
  _createInitialState,
  reduceBattleBoard,
} = require('../../src/reducers/battle-board');
const { findSquareByCoordinate } = require('../../src/state-models/square-matrix');


describe('reducers/battle-board', () => {
  describe('initialState', () => {
    it('should be set at first', () => {
      const state = reduceBattleBoard(undefined, { type: ACTION_TYPES.NOOP });
      assert.strictEqual(typeof state, 'object');
      assert('boardType' in state);
    });
  });

  describe('EXTEND_BATTLE_BOARD_SQUARE_MATRIX', () => {
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
      assert.strictEqual(findSquareByCoordinate(state.squareMatrix, [0, 0]).landformType, null);
      assert.strictEqual(findSquareByCoordinate(state.squareMatrix, [1, 1]).landformType, null);

      const extension = _createUpdates({ landformType: LANDFORM_TYPES.ROAD });
      state = reduceBattleBoard(state, { type: ACTION_TYPES.EXTEND_BATTLE_BOARD_SQUARE_MATRIX, extension });

      assert.strictEqual(findSquareByCoordinate(state.squareMatrix, [0, 0]).landformType, 'ROAD');
      assert.strictEqual(findSquareByCoordinate(state.squareMatrix, [1, 1]).landformType, 'ROAD');
    });

    it('should throw a error if the squares and the extension is not the same size', () => {
      const extension = _createUpdates({ landformType: LANDFORM_TYPES.ROAD });
      extension.push({});
      assert.throws(() => {
        reduceBattleBoard(state, { type: ACTION_TYPES.EXTEND_BATTLE_BOARD_SQUARE_MATRIX, extension });
      }, /same size/);
    });

    it('should throw a error if a updator includes undefined key', () => {
      const extension = _createUpdates();
      extension[0][0].notDefinedKey = 1;
      assert.throws(() => {
        reduceBattleBoard(state, { type: ACTION_TYPES.EXTEND_BATTLE_BOARD_SQUARE_MATRIX, extension });
      }, /notDefinedKey/);
    });
  });
});
