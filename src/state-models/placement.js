// @flow

/*::
import type { BoardType } from '../constants';
import type { CoordinateState, PlacementState } from '../types/states';
 */


const uuidV4 = require('uuid').v4;

const { BOARD_TYPES } = require('../constants');
const { areSameCoordinates, createNewCoordinateState } = require('./coordinate');


const createNewPlacementState = (
  boardType/*:BoardType*/, coordinate/*:CoordinateState*/
)/*:PlacementState*/ => {
  // MEMO: Temporary assertion for refactoring
  if (!boardType || !coordinate) {
    throw new Error('Invalid arguments');
  }

  return {
    boardType,
    coordinate,
  };
};

const areSamePlacements = (...placements/*:PlacementState[]*/)/*:boolean*/ => {
  const [first, ...rest] = placements;
  return rest.every(v => {
    return first.boardType === v.boardType &&
      areSameCoordinates(first.coordinate, v.coordinate);
  });
};


module.exports = {
  areSamePlacements,
  createNewPlacementState,
};
