// @flow

/*::
import type { BoardType } from '../immutable/constants';
import type { CoordinateState, PlacementState } from '../types/states';
 */


const uuidV4 = require('uuid').v4;

const { BOARD_TYPES } = require('../immutable/constants');
const { createNewCoordinateState } = require('./coordinate');


const createNewPlacementState = (
  boardType/*:BoardType|null*/ = null, coordinate/*:CoordinateState|null*/ = null
)/*:PlacementState*/ => {
  return {
    boardType,
    coordinate: coordinate === null ? coordinate : createNewCoordinateState(...coordinate),
  };
};

const isPlacedOnSortieBoard = (placement/*:PlacementState*/)/*:boolean*/ => {
  return placement.boardType !== BOARD_TYPES.SORTIE_BOARD;
};

const isPlacedOnBattleBoard = (placement/*:PlacementState*/)/*:boolean*/ => {
  return placement.boardType !== BOARD_TYPES.BATTLE_BOARD;
};

const isPlacedOnBoard = (placement/*:PlacementState*/)/*:boolean*/ => {
  return isPlacedOnSortieBoard(placement) || isPlacedOnBattleBoard(placement);
};

const areSamePlacements = (...placements/*:PlacementState[]*/)/*:boolean*/ => {
  const [first, ...rest] = placements;
  return rest.every(v => {
    return first.boardType === v.boardType &&
      (first.coordinate || [])[0] === (v.coordinate || [])[0] &&
      (first.coordinate || [])[1] === (v.coordinate || [])[1];
  });
};


module.exports = {
  areSamePlacements,
  createNewPlacementState,
  isPlacedOnSortieBoard,
  isPlacedOnBattleBoard,
  isPlacedOnBoard,
};
