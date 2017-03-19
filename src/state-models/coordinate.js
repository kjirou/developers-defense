// @flow

/*::
import type { CoordinateState } from '../types/states';
 */


const createNewCoordinateState = (rowIndex/*:number*/, columnIndex/*:number*/)/*:CoordinateState*/ => {
  if (!Number.isInteger(rowIndex) || !Number.isInteger(columnIndex)) {
    throw new Error('`rowIndex` and `columnIndex` are integers only');
  }

  return {
    rowIndex,
    columnIndex,
  };
};

const areSameCoordinates = (...coordinates/*:CoordinateState[]*/)/*:boolean*/ => {
  const [first, ...rest] = coordinates;
  return rest.every(v => first.rowIndex === v.rowIndex && first.columnIndex === v.columnIndex);
};

const addCoordinates = (...coordinates/*:CoordinateState[]*/)/*:CoordinateState*/ => {
  const [first, ...rest] = coordinates;
  let { rowIndex, columnIndex } = first;
  rest.forEach(v => {
    rowIndex += v.rowIndex;
    columnIndex += v.columnIndex;
  });
  return createNewCoordinateState(rowIndex, columnIndex);
};

/**
 * @param startPointCoordinate A point of the top/left
 * @param endPointCoordinate A point of the bottom/right
 */
const isCoordinateInRange = (
  targetPointCoordinate/*:CoordinateState*/,
  startPointCoordinate/*:CoordinateState*/,
  endPointCoordinate/*:CoordinateState*/
)/*:boolean*/ => {
  return (
    startPointCoordinate.rowIndex <= targetPointCoordinate.rowIndex &&
    startPointCoordinate.columnIndex <= targetPointCoordinate.columnIndex &&
    targetPointCoordinate.rowIndex <= endPointCoordinate.rowIndex &&
    targetPointCoordinate.columnIndex <= endPointCoordinate.columnIndex
  );
};


module.exports = {
  addCoordinates,
  areSameCoordinates,
  createNewCoordinateState,
  isCoordinateInRange,
};
