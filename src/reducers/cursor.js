const { ACTION_TYPES, PARAMETERS } = require('../immutable/constants');
const { createInitialSquareMatrixState } = require('../state-computers/square-matrix');


const createInitialState = () => {
  return {
    boardType: null,
    coordinate: null,
  };
};


const initialState = createInitialState();
const reduceCursor = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.CLEAR_CURSOR:
      return (() => {
        return createInitialState();
      })(action);
    case ACTION_TYPES.MOVE_CURSOR:
      return (({ boardType, coordinate }) => {
        return Object.assign({}, state, { boardType, coordinate });
      })(action);
    default:
      return state;
  }
};


module.exports = {
  _createInitialState: createInitialState,
  reduceCursor,
};
