const { createInitialSquareState } = require('./square');


const createInitialSquareMatrixState = (rowLength, columnLength) => {
  return Array.from({ length: rowLength }).map((notUsed, rowIndex) => {
    return Array.from({ length: columnLength }).map((notUsed, columnIndex) => {
      return createInitialSquareState(rowIndex, columnIndex);
    });
  });
};

/**
 * @return {?Object} A square state
 */
const findSquareByCoordinate = (squareMatrix, [ rowIndex, columnIndex ]) => {
  const row = squareMatrix[rowIndex];
  if (!row) return null;
  const square = row[columnIndex];
  return square || null;
};


module.exports = {
  createInitialSquareMatrixState,
  findSquareByCoordinate,
};
