const uuidV4 = require('uuid/v4');


/**
 * @typedef {Object} State~Square
 * @property {?string} uid
 * @property {number[]} coordinate
 * @property {?string} landformType - One of the LANDFORM_TYPES
 */

const createNewSquareState = (rowIndex, columnIndex) => {
  return {
    uid: uuidV4(),
    /** @type {number[]} */
    coordinate: [rowIndex, columnIndex],
    /** @type {?string} A one of LANDFORM_TYPES */
    landformType: null,
  };
};

/**
 * @param {Object} square
 * @param {Object} properties
 * @return {Object} A shallow-copied square state
 */
const extendSquare = (square, properties) => {
  Object.keys(properties).forEach(key => {
    if (!square.hasOwnProperty(key)) {
      throw new Error(`key="${ key }" is not defined`);
    }
  });
  return Object.assign({}, square, properties);
};


module.exports = {
  createNewSquareState,
  extendSquare,
};
