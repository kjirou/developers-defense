// @flow

/*::
import type { CoordinateState, SquareState } from '../types/states';
 */


const uuidV4 = require('uuid/v4');

const { createNewCoordinateState } = require('./coordinate');


const createNewSquareState = (rowIndex/*:number*/, columnIndex/*:number*/)/*:SquareState*/ => {
  return {
    uid: uuidV4(),
    coordinate: createNewCoordinateState(rowIndex, columnIndex),
    landformType: null,
  };
};

const extendSquare = (square/*:SquareState*/, properties/*:{}*/)/*:SquareState*/ => {
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
