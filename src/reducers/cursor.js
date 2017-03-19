// @flow

/*::
import type { PlacementState } from '../types/states';
 */

const { createReducer } = require('redux-create-reducer');

const { ACTION_TYPES, PARAMETERS } = require('../immutable/constants');


const createInitialState = ()/*:{ placement: PlacementState | null }*/ => {
  return {
    placement: null,
  };
};


const handlers = {
  [ACTION_TYPES.CLEAR_CURSOR]: (state) => {
    return Object.assign({}, state, {
      placement: null,
    });
  },

  [ACTION_TYPES.MOVE_CURSOR]: (state, { placement }) => {
    return Object.assign({}, state, { placement });
  },
};


module.exports = {
  _createInitialState: createInitialState,
  reduceCursor: createReducer(createInitialState(), handlers),
};
