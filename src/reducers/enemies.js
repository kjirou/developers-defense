const { ACTION_TYPES, PARAMETERS } = require('../immutable/constants');


const createInitialState = () => {
  return [];
};


const updateEnemies = (state, { units }) => {
  return units.slice();
};

const initialState = createInitialState();
const reduceEnemies = (state = initialState, action) => {
  switch (action.type || '') {
    case ACTION_TYPES.UPDATE_ENEMIES:
      return updateEnemies(state, action);
    default:
      return state;
  }
};


module.exports = {
  _createInitialState: createInitialState,
  reduceEnemies,
};
