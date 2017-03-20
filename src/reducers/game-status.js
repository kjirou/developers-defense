// @flow

const { createReducer } = require('redux-create-reducer');

const { ACTION_TYPES } = require('../immutable/constants');


const createInitialState = () => {
  return {
    tickId: null,  // null or integer >= 0
    isPaused: false,
  };
};


const alterLimitedValue = (value, delta, min, max) => {
  return Math.min(max, Math.max(min, value + delta));
};


const handlers = {
  [ACTION_TYPES.EXTEND_GAME_STATUS]: (state, { extension }) => {
    return Object.assign({}, state, extension);
  },

  [ACTION_TYPES.TICK]: (state, { tickId }) => {
    return Object.assign({}, state, {
      tickId,
    });
  },
};


module.exports = {
  _createInitialState: createInitialState,
  reduceGameStatus: createReducer(createInitialState(), handlers),
};
