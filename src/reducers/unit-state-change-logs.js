// @flow

const { createReducer } = require('redux-create-reducer');

const { ACTION_TYPES } = require('../constants');


const createInitialState = () => {
  return [];
};


const handlers = {
  [ACTION_TYPES.TICK]: (state, { unitStateChangeLogs }) => {
    return unitStateChangeLogs;
  },
};


module.exports = {
  _createInitialState: createInitialState,
  reduceUnitStateChangeLogs: createReducer(createInitialState(), handlers),
};
