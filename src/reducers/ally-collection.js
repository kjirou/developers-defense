const { ACTION_TYPES, PARAMETERS } = require('../immutable/constants');
const { createBranchReducer } = require('../lib/core');
const { createNewUnitCollectionState } = require('../state-models/unit-collection');


const createInitialState = () => {
  return createNewUnitCollectionState();
};


const reducements = {
  [ACTION_TYPES.UPDATE_ALLY_COLLECTION]: (state, { collection }) => {
    return collection.slice();
  },
};


module.exports = {
  _createInitialState: createInitialState,
  reduceAllyCollection: createBranchReducer(reducements, createInitialState()),
};
