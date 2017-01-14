/**
 * @typedef {Array<Array<State~Square>>} State~SquareMatrix
 * @description Each side is at least 1 or more in length.
 */


/** @module */
const { LANDFORM_TYPES } = require('../immutable/constants');
const { areSameSizeMatrices } = require('../lib/core');
const { createNewCoordinateState } = require('./coordinate');
const { createNewSquareState, extendSquare } = require('./square');


const createNewSquareMatrixState = (rowLength, columnLength) => {
  if (rowLength <= 0 || columnLength <= 0) {
    throw new Error('Each side is at least 1 or more in length');
  }

  return Array.from({ length: rowLength }).map((notUsed, rowIndex) => {
    return Array.from({ length: columnLength }).map((notUsed, columnIndex) => {
      return createNewSquareState(rowIndex, columnIndex);
    });
  });
};

/**
 * @return {State~Coordinate}
 */
const getEndPointCoordinate = (squareMatrix) => {
  return createNewCoordinateState(squareMatrix.length - 1, squareMatrix[0].length - 1);
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
 * @param {State~squareMatrix} squareMatrix
 * @param {string} uid
 * @return {?State~Square}
 */
const findSquareByUid = (squareMatrix, uid) => {
  for (let rowIndex = 0; rowIndex < squareMatrix.length; rowIndex += 1) {
    const rowSquares = squareMatrix[rowIndex];
    for (let columnIndex = 0; columnIndex < rowSquares.length; columnIndex += 1) {
      const square = rowSquares[columnIndex];
      if (square.uid === uid) return square;
    }
  }
  return null;
};

/**
 * @param {State~squareMatrix} squareMatrix
 * @return {?State~Square}
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
  if (!areSameSizeMatrices(squareMatrix, propertiesMatrix)) {
    throw new Error('Both arrarys are not the same size');
  }

  return mapSquareMatrix(squareMatrix, (square) => {
    const updater = propertiesMatrix[square.coordinate[0]][square.coordinate[1]];
    return extendSquare(square, updater);
  });
};

/**
 * @param {string} mapSymbol - A single character string
 * @return {?string}
 */
const parseMapSymbol = (mapSymbol) => {
  return {
    'C': LANDFORM_TYPES.CASTLE,
    '.': LANDFORM_TYPES.GRASSFIELD,
    'F': LANDFORM_TYPES.FORT,
    ' ': LANDFORM_TYPES.ROAD,
  }[mapSymbol] || null;
};

/**
 * @param {string} mapText
 * @return {Object[]} An object list to use as the `extendSquareMatrix`
 */
const parseMapText = (mapText) => {
  return mapText.trim().split('\n')
    .map(line => {
      return line.split('').map(mapSymbol => {
        const landformType = parseMapSymbol(mapSymbol);
        if (landformType === null) {
          throw new Error(`map-symbol=${ mapSymbol } is not defined`);
        }
        return { landformType };
      });
    })
  ;
};


module.exports = {
  cloneSquareMatrix,
  createNewSquareMatrixState,
  extendSquareMatrix,
  getEndPointCoordinate,
  findSquareByCoordinate,
  findSquareByUid,
  mapSquareMatrix,
  parseMapText,
};
