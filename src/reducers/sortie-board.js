const { createReducer } = require('redux-create-reducer');

const { ACTION_TYPES, BOARD_TYPES, PARAMETERS } = require('../immutable/constants');
const { createNewBoardState } = require('../state-models/board');


const createInitialState = () => {
  return createNewBoardState(
    BOARD_TYPES.SORTIE_BOARD,
    PARAMETERS.SORTIE_BOARD_ROW_LENGTH,
    PARAMETERS.SORTIE_BOARD_COLUMN_LENGTH
  );
};


module.exports = {
  _createInitialState: createInitialState,
  reduceSortieBoard: createReducer(createInitialState(), {}),
};
