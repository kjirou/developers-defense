const { ACTION_TYPES, PARAMETERS } = require('../immutable/constants');
const { createInitialSquareMatrixState } = require('../state-computers/square-matrix');


const createInitialState = () => {
  return {
    cursorBelongingType: null,
    coordinate: null,
  };
};


const initialState = createInitialState();
const reduceCursor = (state = initialState, action) => {
  switch (action.type || '') {
    case ACTION_TYPES.MOVE_CURSOR:
      return (({ cursorBelongingType, coordinate }) => {
        return Object.assign({}, state, { cursorBelongingType, coordinate });
      })(action);
    default:
      return state;
  }
};


module.exports = {
  _createInitialState: createInitialState,
  reduceCursor,
};
