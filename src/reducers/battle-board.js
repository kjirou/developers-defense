// @flow

const { createReducer } = require('redux-create-reducer');

const { ACTION_TYPES, BOARD_TYPES, PARAMETERS } = require('../immutable/constants');
const { createNewBoardState } = require('../state-models/board');
const { extendSquareMatrix } = require('../state-models/square-matrix');


const createInitialState = () => {
  return createNewBoardState(
    BOARD_TYPES.BATTLE_BOARD,
    PARAMETERS.BATTLE_BOARD_ROW_LENGTH,
    PARAMETERS.BATTLE_BOARD_COLUMN_LENGTH
  );
};


const handlers = {
  [ACTION_TYPES.EXTEND_BATTLE_BOARD_SQUARE_MATRIX]: (state, { extension }) => {
    return Object.assign({}, state, {
      squareMatrix: extendSquareMatrix(state.squareMatrix, extension),
    });
  },
};


module.exports = {
  _createInitialState: createInitialState,
  reduceBattleBoard: createReducer(createInitialState(), handlers),
};
