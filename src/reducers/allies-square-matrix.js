const { ACTION_TYPES, PARAMETERS } = require('../immutable/constants');
const { areSameSize2DArray } = require('../lib/core');
const { createNewSquareMatrixState } = require('../state-models/square-matrix');


const createInitialState = () => {
  return createNewSquareMatrixState(
    PARAMETERS.ALLIES_BOARD_ROW_LENGTH, PARAMETERS.ALLIES_BOARD_COLUMN_LENGTH);
};


const initialState = createInitialState();
const reduceAlliesSquareMatrix = (state = initialState, action) => {
  switch (action.type || '') {
    default:
      return state;
  }
};


module.exports = {
  _createInitialState: createInitialState,
  reduceAlliesSquareMatrix,
};
