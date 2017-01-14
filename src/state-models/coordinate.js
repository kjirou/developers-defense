/**
 * @typedef {number[]} State~Coordinate
 * @description The position of a square-matrix. For example, it means [rowIndex, columnIndex] or [m, n].<br>
 *              It allows floating point numbers.
 */


/** @module */
const createNewCoordinateState = (rowIndex, columnIndex) => {
  return [rowIndex, columnIndex];
};


module.exports = {
  createNewCoordinateState,
};
