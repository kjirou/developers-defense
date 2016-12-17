const assert = require('power-assert');

const { LANDFORM_TYPES, PARAMETERS } = require('../../src/consts');
const {
  _createInitialState,
  _findSquareByCoordinate,
  parseMapText,
  reduceBattleSquares,
} = require('../../src/reducers/battle-squares');


describe('reducers/battle-squares', () => {
  describe('initialState', () => {
    it('should be set at first', () => {
      const state = reduceBattleSquares(undefined, { type: 'NOOP' });
      assert.deepStrictEqual(state, _createInitialState());
    });

    it('should initialize coordinate properties', () => {
      const state = reduceBattleSquares(undefined, { type: 'NOOP' });

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

  describe('SET_LANDFORM_TYPE', () => {
    let state;

    beforeEach(() => {
      state = _createInitialState();
      _findSquareByCoordinate(state, [0, 0]).landformType = LANDFORM_TYPES.ROAD;
      _findSquareByCoordinate(state, [1, 1]).landformType = LANDFORM_TYPES.GRASSFIELD;
    });

    it('can set', () => {
      assert.strictEqual(_findSquareByCoordinate(state, [0, 0]).landformType, 'ROAD');
      assert.strictEqual(_findSquareByCoordinate(state, [1, 1]).landformType, 'GRASSFIELD');
      state = reduceBattleSquares(state, { type: 'SET_LANDFORM_TYPE', coordinate: [0, 0], landformType: LANDFORM_TYPES.GRASSFIELD });
      state = reduceBattleSquares(state, { type: 'SET_LANDFORM_TYPE', coordinate: [1, 1], landformType: LANDFORM_TYPES.ROAD });
      assert.strictEqual(_findSquareByCoordinate(state, [0, 0]).landformType, 'GRASSFIELD');
      assert.strictEqual(_findSquareByCoordinate(state, [1, 1]).landformType, 'ROAD');
    });

    it('should not break before state', () => {
      const newState = reduceBattleSquares(state, { type: 'SET_LANDFORM_TYPE', coordinate: [0, 0], landformType: LANDFORM_TYPES.GRASSFIELD });
      assert.strictEqual(_findSquareByCoordinate(state, [0, 0]).landformType, 'ROAD');
      assert.strictEqual(_findSquareByCoordinate(newState, [0, 0]).landformType, 'GRASSFIELD');
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
      assert.strictEqual(_findSquareByCoordinate(state, [0, 0]).landformType, null);
      assert.strictEqual(_findSquareByCoordinate(state, [1, 1]).landformType, null);

      const updates = _createUpdates({ landformType: LANDFORM_TYPES.ROAD });
      state = reduceBattleSquares(state, { type: 'UPDATE_ALL_SQUARES', updates });

      assert.strictEqual(_findSquareByCoordinate(state, [0, 0]).landformType, 'ROAD');
      assert.strictEqual(_findSquareByCoordinate(state, [1, 1]).landformType, 'ROAD');
    });

    it('should throw a error if the squares and the updates are not the same size', () => {
      const updates = _createUpdates({ landformType: LANDFORM_TYPES.ROAD });
      updates.push({});
      assert.throws(() => {
        reduceBattleSquares(state, { type: 'UPDATE_ALL_SQUARES', updates });
      }, /same size/);
    });

    it('should throw a error if a updator includes undefined key', () => {
      const updates = _createUpdates();
      updates[0][0].notDefinedKey = 1;
      assert.throws(() => {
        reduceBattleSquares(state, { type: 'UPDATE_ALL_SQUARES', updates });
      }, /notDefinedKey/);
    });
  });
});
