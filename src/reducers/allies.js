const { createReducer } = require('redux-create-reducer');

const { ACTION_TYPES, PARAMETERS } = require('../immutable/constants');
const { createNewUnitCollectionState, findUnitByUid } = require('../state-models/unit-collection');


const createInitialState = () => {
  return createNewUnitCollectionState();
};


const reducements = {
  [ACTION_TYPES.UPDATE_ALLY]: (state, { ally }) => {
    const currentAlly = findUnitByUid(state, ally.uid);
    if (!currentAlly) {
      throw new Error(`The ally.uid="${ ally.uid }" does not exist`);
    }
    const index = state.indexOf(currentAlly);
    const newCollection = state.slice();
    newCollection[index] = ally;
    return newCollection;
  },

  [ACTION_TYPES.TICK]: (state, { allies }) => {
    return allies;
  },

  [ACTION_TYPES.UPDATE_ALLIES]: (state, { allies }) => {
    return allies;
  },
};


module.exports = {
  _createInitialState: createInitialState,
  reduceAllies: createReducer(createInitialState(), reducements),
};
