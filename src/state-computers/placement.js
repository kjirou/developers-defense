const uuidV4 = require('uuid/v4');

const { BOARD_TYPES } = require('../immutable/constants');


const createNewPlacementState = () => {
  return {
    /** @type {?string} */
    boardType: null,
    /** @type {?number[]} */
    coordinate: null,
  };
};


module.exports = {
  createNewPlacementState,
};
