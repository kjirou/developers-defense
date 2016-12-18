const uuidV4 = require('uuid/v4');


const createInitialSquareState = (rowIndex, columnIndex) => {
  return {
    uid: uuidV4(),
    /** @type {number[]} */
    coordinate: [rowIndex, columnIndex],
    /** @type {?string} A one of LANDFORM_TYPES */
    landformType: null,
  };
};


module.exports = {
  createInitialSquareState,
};
