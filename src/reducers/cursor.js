const { createBranchReducer } = require('../lib/core');
const { ACTION_TYPES, PARAMETERS } = require('../immutable/constants');
const { createNewPlacementState } = require('../state-models/placement');


const createInitialState = () => {
  return {
    placement: createNewPlacementState(),
  };
};


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


module.exports = {
  _createInitialState: createInitialState,
  reduceCursor: createBranchReducer(reducements, createInitialState()),
};
