// @flow

/*::
import type { CoordinateState } from '../types/states';
 */


const createNewCoordinateState = (rowIndex/*:number*/, columnIndex/*:number*/)/*:CoordinateState*/ => {
  if (!Number.isInteger(rowIndex) || !Number.isInteger(columnIndex)) {
    throw new Error('`rowIndex` and `columnIndex` are integers only');
  }

  if (rowIndex < 0 || columnIndex < 0) {
    throw new Error('Negative numbers are not included in `rowIndex` and `columnIndex`');
  }

  return [rowIndex, columnIndex];
};

const areSameCoordinates = (...coordinates/*:CoordinateState[]*/)/*:boolean*/ => {
  const [first, ...rest] = coordinates;
  return rest.every(v => first[0] === v[0] && first[1] === v[1]);
};

const tryToMoveCoordinate = (
  coordinate/*:CoordinateState*/, rowIndexDelta/*:number*/, columnIndexDelta/*:number*/
)/*:CoordinateState|null*/ => {
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
