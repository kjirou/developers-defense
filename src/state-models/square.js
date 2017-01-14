/**
 * @typedef {Object} State~Square
 * @property {?string} uid
 * @property {State~Coordinate} coordinate
 * @property {?string} landformType - One of the LANDFORM_TYPES
 */


/** @module */
const uuidV4 = require('uuid/v4');

const { createNewCoordinateState } = require('./coordinate');


const createNewSquareState = (rowIndex, columnIndex) => {
  return {
    uid: uuidV4(),
    coordinate: createNewCoordinateState(rowIndex, columnIndex),
    landformType: null,
  };
};

/**
 * @param {State~Square} square
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
