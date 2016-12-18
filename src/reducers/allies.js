const { ACTION_TYPES, PARAMETERS } = require('../immutable/constants');


const createInitialState = () => {
  return [];
};


const updateAllies = (state, { units }) => {
  return units.slice();
};

const initialState = createInitialState();
const reduceAllies = (state = initialState, action) => {
  switch (action.type || '') {
    case ACTION_TYPES.UPDATE_ALLIES:
      return updateAllies(state, action);
    default:
      return state;
  }
};


module.exports = {
  _createInitialState: createInitialState,
  reduceAllies,
};
