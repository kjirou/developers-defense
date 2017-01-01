const { createReducer } = require('redux-create-reducer');

const { ACTION_TYPES, PARAMETERS } = require('../immutable/constants');


const createInitialState = () => {
  return {
    tickId: null,  // null or integer >= 0
    maxProgress: PARAMETERS.MAX_PROGRESS,
    progress: PARAMETERS.MIN_PROGRESS,
  };
};


const alterLimitedValue = (value, delta, min, max) => {
  return Math.min(max, Math.max(min, value + delta));
};


const handlers = {
  [ACTION_TYPES.ALTER_PROGRESS]: (state, { delta }) => {
    return Object.assign({}, state, {
      progress: alterLimitedValue(state.progress, delta, PARAMETERS.MIN_PROGRESS, PARAMETERS.MAX_PROGRESS),
    });
  },

  [ACTION_TYPES.TICK]: (state, { tickId }) => {
    return Object.assign({}, state, {
      tickId,
    });
  },

  [ACTION_TYPES.UPDATE_TICK_ID]: (state, { tickId }) => {
    return Object.assign({}, state, {
      tickId,
    });
  },
};


module.exports = {
  _createInitialState: createInitialState,
  reduceGameStatus: createReducer(createInitialState(), handlers),
};
