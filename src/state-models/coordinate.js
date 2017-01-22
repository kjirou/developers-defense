/**
 * @typedef {number[]} State~Coordinate
 * @description The position of a square-matrix. For example, it means [rowIndex, columnIndex] or [m, n].
 */


/** @module */
const createNewCoordinateState = (rowIndex, columnIndex) => {
  if (!Number.isInteger(rowIndex) || !Number.isInteger(columnIndex)) {
    throw new Error('`rowIndex` and `columnIndex` are integers only');
  }

  if (rowIndex < 0 || columnIndex < 0) {
    throw new Error('Negative numbers are not included in `rowIndex` and `columnIndex`');
  }

  return [rowIndex, columnIndex];
};

/**
 * @param {...State~Coordinate} coordinates
 * @return {boolean}
 */
const areSameCoordinates = (...coordinates) => {
  const [first, ...rest] = coordinates;
  return rest.every(v => first[0] === v[0] && first[1] === v[1]);
};

/**
 * @param {State~Coordinate} coordinate
 * @param {number} rowIndexDelta
 * @param {number} columnIndexDelta
 * @return {?State~Coordinate}
 */
const tryToMoveCoordinate = (coordinate, rowIndexDelta, columnIndexDelta) => {
  try {
    return createNewCoordinateState(coordinate[0] + rowIndexDelta, coordinate[1] + columnIndexDelta);
  } catch (error) {
    return null;
  }
};


module.exports = {
  areSameCoordinates,
  createNewCoordinateState,
  tryToMoveCoordinate,
};
