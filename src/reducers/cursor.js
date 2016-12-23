const { ACTION_TYPES, PARAMETERS } = require('../immutable/constants');
const { createNewPlacementState } = require('../state-computers/placement');
const { createInitialSquareMatrixState } = require('../state-computers/square-matrix');


const createInitialState = () => {
  return {
    placement: createNewPlacementState(),
  };
};

const initialState = createInitialState();

const reducements = {
  [ACTION_TYPES.CLEAR_CURSOR]: (state) => {
    return Object.assign({}, state, {
      placement: createNewPlacementState(),
    });
  },

  [ACTION_TYPES.MOVE_CURSOR]: (state, { placement }) => {
    return Object.assign({}, state, { placement });
  },
};

const reduceCursor = (state = initialState, action) => {
  // NOTICE: The "@@redux/INIT" action.type may come.
  //         Ref) https://github.com/reactjs/redux/issues/382
  const reducement = reducements[action.type] || null;
  return reducement ? reducement(state, action) : state;
};


module.exports = {
  _createInitialState: createInitialState,
  reduceCursor,
};
