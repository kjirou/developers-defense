const uuidV4 = require('uuid/v4');

const { BOARD_TYPES } = require('../immutable/constants');


/**
 * @typedef {Object} State~Placement
 * @property {?string} boardType - One of the BOARD_TYPES
 * @property {?number[]} coordinate - The position of a matrix. ex) [m, n]
 */
const createNewPlacementState = () => {
  return {
    boardType: null,
    coordinate: null,
  };
};


/**
 * @param {...State~Placement[]} placements
 * @return {boolean}
 */
const areSamePlace = (...placements) => {
  const [first, ...rest] = placements;
  return rest.every(v => {
    return first.boardType === v.boardType &&
      (first.coordinate || [])[0] === (v.coordinate || [])[0] &&
      (first.coordinate || [])[1] === (v.coordinate || [])[1];
  });
};


module.exports = {
  createNewPlacementState,
  areSamePlace,
};
