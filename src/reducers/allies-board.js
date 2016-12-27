const { createReducer } = require('redux-create-reducer');

const { ACTION_TYPES, BOARD_TYPES, PARAMETERS } = require('../immutable/constants');
const { createNewBoardState } = require('../state-models/board');


const createInitialState = () => {
  return createNewBoardState(
    BOARD_TYPES.ALLIES_BOARD,
    PARAMETERS.ALLIES_BOARD_ROW_LENGTH,
    PARAMETERS.ALLIES_BOARD_COLUMN_LENGTH
  );
};


module.exports = {
  _createInitialState: createInitialState,
  reduceAlliesBoard: createReducer(createInitialState(), {}),
};
