// @flow

/*::
import type { BoardState } from '../types/states';
 */


const { createNewSquareMatrixState } = require('./square-matrix');


const createNewBoardState = (
  boardType/*:string*/, rowLength/*:number*/, columnLength/*:number*/
)/*:BoardState*/ => {
  return {
    boardType,
    squareMatrix: createNewSquareMatrixState(rowLength, columnLength),
  };
};


module.exports = {
  createNewBoardState,
};
