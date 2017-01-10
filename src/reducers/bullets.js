const { createReducer } = require('redux-create-reducer');

const { ACTION_TYPES, PARAMETERS } = require('../immutable/constants');


const createInitialState = () => {
  return [];
};


const handlers = {
  [ACTION_TYPES.UPDATE_BULLETS]: (state, { bullets }) => {
    return bullets;
  },

  [ACTION_TYPES.TICK]: (state, { bullets }) => {
    return bullets;
  },
};


module.exports = {
  _createInitialState: createInitialState,
  reduceBullets: createReducer(createInitialState(), handlers),
};
