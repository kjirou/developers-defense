// @flow

const { createReducer } = require('redux-create-reducer');

const { ACTION_TYPES, PARAMETERS } = require('../constants');
const { createNewUnitCollectionState, findUnitByUid } = require('../state-models/unit-collection');


const createInitialState = () => {
  return createNewUnitCollectionState();
};


const handlers = {
  [ACTION_TYPES.UPDATE_ENEMIES]: (state, { enemies }) => {
    return enemies;
  },

  [ACTION_TYPES.TICK]: (state, { enemies }) => {
    return enemies;
  },
};


module.exports = {
  _createInitialState: createInitialState,
  reduceEnemies: createReducer(createInitialState(), handlers),
};
