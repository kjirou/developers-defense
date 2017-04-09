// @flow

/*::
import type { CoordinateState, RectangleState, SquareMatrixState, SquareState } from '../types/states';
 */


const { LANDFORM_TYPES, PARAMETERS } = require('../constants');
const { areSameSizeMatrices } = require('../lib/core');
const { createNewCoordinateState } = require('./coordinate');
const { createNewRectangleState } = require('./rectangle');
const { createNewSquareState, extendSquare } = require('./square');


const createNewSquareMatrixState = (rowLength/*:number*/, columnLength/*:number*/)/*:SquareMatrixState*/ => {
  if (rowLength <= 0 || columnLength <= 0) {
    throw new Error('Each side is at least 1 or more in length');
  }

  return Array.from({ length: rowLength }).map((notUsed, rowIndex) => {
    return Array.from({ length: columnLength }).map((notUsed, columnIndex) => {
      return createNewSquareState(rowIndex, columnIndex);
    });
  });
};

const getEndPointCoordinate = (squareMatrix/*:SquareMatrixState*/)/*:CoordinateState*/ => {
  return createNewCoordinateState(squareMatrix.length - 1, squareMatrix[0].length - 1);
};

const toRectangle = (squareMatrix/*:SquareMatrixState*/)/*:RectangleState*/ => {
  return createNewRectangleState({
    x: 0,
    y: 0,
    width: squareMatrix[0].length * PARAMETERS.SQUARE_SIDE_LENGTH,
    height: squareMatrix.length * PARAMETERS.SQUARE_SIDE_LENGTH,
  });
};

const mapSquareMatrix = (
  squareMatrix/*:SquareMatrixState*/, callback/*:(SquareState) => SquareState*/
)/*:SquareMatrixState*/ => {
  return squareMatrix.map(rowSquares => {
    return rowSquares.map(square => {
      return callback(square);
    });
  });
};

const findSquareByUid = (squareMatrix/*:SquareMatrixState*/, uid/*:string*/)/*:SquareState|null*/ => {
  for (let rowIndex = 0; rowIndex < squareMatrix.length; rowIndex += 1) {
    const rowSquares = squareMatrix[rowIndex];
    for (let columnIndex = 0; columnIndex < rowSquares.length; columnIndex += 1) {
      const square = rowSquares[columnIndex];
      if (square.uid === uid) return square;
    }
  }
  return null;
};

const findSquareByCoordinate = (
  squareMatrix/*:SquareMatrixState*/, coordinate/*:CoordinateState*/
)/*:SquareState | null*/ => {
  const { rowIndex, columnIndex } = coordinate;
  const row = squareMatrix[rowIndex];
  if (!row) return null;
  const square = row[columnIndex];
  return square || null;
};

const extendSquareMatrix = (
  squareMatrix/*:SquareMatrixState*/, propertiesMatrix/*:Object[][]*/
)/*:SquareMatrixState*/ => {
  if (!areSameSizeMatrices(squareMatrix, propertiesMatrix)) {
    throw new Error('Both arrarys are not the same size');
  }

  return mapSquareMatrix(squareMatrix, (square) => {
    const updater = propertiesMatrix[square.coordinate.rowIndex][square.coordinate.columnIndex];
    return extendSquare(square, updater);
  });
};

const parseMapSymbol = (mapSymbol/*:string*/)/*:string|null*/ => {
  return {
    'C': LANDFORM_TYPES.CASTLE,
    '.': LANDFORM_TYPES.GRASSFIELD,
    'F': LANDFORM_TYPES.FORT,
    ' ': LANDFORM_TYPES.ROAD,
  }[mapSymbol] || null;
};

/**
 * @return An object list to use as the `extendSquareMatrix`
 */
const parseMapText = (mapText/*:string*/)/*:{}[][]*/ => {
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
  createNewSquareMatrixState,
  extendSquareMatrix,
  getEndPointCoordinate,
  findSquareByCoordinate,
  findSquareByUid,
  mapSquareMatrix,
  parseMapText,
  toRectangle,
};
