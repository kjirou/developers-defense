// @flow

const { createReducer } = require('redux-create-reducer');

const { ACTION_TYPES, PARAMETERS } = require('../immutable/constants');


const createInitialState = () => {
  return [];
};


const handlers = {
  [ACTION_TYPES.UPDATE_EFFECT_LOGS]: (state, { effectLogs }) => {
    return effectLogs;
  },

  [ACTION_TYPES.TICK]: (state, { effectLogs }) => {
    return effectLogs;
  },
};


module.exports = {
  _createInitialState: createInitialState,
  reduceEffectLogs: createReducer(createInitialState(), handlers),
};
