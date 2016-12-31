/**
 * @typedef {Object} State~Board
 * @property {string} boardType - One of the BOARD_TYPES
 * @property {State~SquareMatrix} squareMatrix
 */


/** @module */
const { createNewSquareMatrixState } = require('./square-matrix');


const createNewBoardState = (boardType, rowLength, columnLength) => {
  return {
    boardType,
    squareMatrix: createNewSquareMatrixState(rowLength, columnLength),
  };
};


module.exports = {
  createNewBoardState,
};
