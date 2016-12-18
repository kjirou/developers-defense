const { areSameSize2DArray } = require('../lib/core');
const { createInitialSquareState, extendSquare } = require('./square');


const createInitialSquareMatrixState = (rowLength, columnLength) => {
  return Array.from({ length: rowLength }).map((notUsed, rowIndex) => {
    return Array.from({ length: columnLength }).map((notUsed, columnIndex) => {
      return createInitialSquareState(rowIndex, columnIndex);
    });
  });
};

const mapSquareMatrix = (squareMatrix, callback) => {
  return squareMatrix.map(rowSquares => {
    return rowSquares.map(square => {
      return callback(square);
    });
  });
};

const cloneSquareMatrix = (squareMatrix) => {
  return mapSquareMatrix(squares, (square) => {
    return Object.assign({}, square);
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

/**
 * @param {Object[]} squareMatrix
 * @param {Object[]} propertiesMatrix - A 2D array of the same size as square-matrix
 */
const extendSquareMatrix = (squareMatrix, propertiesMatrix) => {
  if (!areSameSize2DArray(squareMatrix, propertiesMatrix)) {
    throw new Error('Both arrarys are not the same size');
  }

  return mapSquareMatrix(squareMatrix, (square) => {
    const updater = propertiesMatrix[square.coordinate[0]][square.coordinate[1]];
    return extendSquare(square, updater);
  });
};


module.exports = {
  cloneSquareMatrix,
  createInitialSquareMatrixState,
  extendSquareMatrix,
  findSquareByCoordinate,
  mapSquareMatrix,
};
