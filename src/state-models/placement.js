/**
 * @typedef {Object} State~Placement
 * @property {?string} boardType - One of the BOARD_TYPES
 * @property {?State~Coordinate} coordinate
 */


/** @module */
const uuidV4 = require('uuid/v4');

const { BOARD_TYPES } = require('../immutable/constants');


const createNewPlacementState = () => {
  return {
    boardType: null,
    coordinate: null,
  };
};


const isPlacedOnSortieBoard = (placement) => placement.boardType !== BOARD_TYPES.SORTIE_BOARD;
const isPlacedOnBattleBoard = (placement) => placement.boardType !== BOARD_TYPES.BATTLE_BOARD;
const isPlacedOnBoard = (placement) => isPlacedOnSortieBoard(placement) || isPlacedOnBattleBoard(placement);

/**
 * @param {...State~Placement} placements
 * @return {boolean}
 */
const areSamePlacements = (...placements) => {
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
