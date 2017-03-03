// @flow

/*::
import type { CoordinateState, LocationState, RectangleState } from '../types/states';
 */


const { areBoxesOverlapping } = require('box-overlap');

const { STYLES } = require('../immutable/constants');
const { expandReachToRelativeCoordinates } = require('../lib/core');
const coordinateMethods = require('./coordinate');
const locationMethods = require('./location');
const rectangleMethods = require('./rectangle');


/**
 * Where is the location as coordinates
 * @throws {Error} If clearly invalid as coordinate
 */
const locationToCoordinate = (location/*:LocationState*/)/*:CoordinateState*/ => {
  return coordinateMethods.createNewCoordinateState(
    Math.floor(location.y / STYLES.SQUARE_HEIGHT),
    Math.floor(location.x / STYLES.SQUARE_WIDTH)
  );
};

/**
 * Generate a rectangle starting from a location
 * @throws {Error} The width and the height are not divisible if `asCenterPoint` is specified.
 */
const locationToRectangle = (
  location/*:LocationState*/,
  options/*:{
    width?: number,
    height?: number,
    asCenterPoint?: boolean,
  }*/ = {}
)/*:RectangleState*/ => {
  const {
    width,
    height,
    asCenterPoint,
  } = Object.assign({
    width: STYLES.SQUARE_WIDTH,
    height: STYLES.SQUARE_HEIGHT,
    asCenterPoint: false,
  }, options);

  let x;
  let y;

  if (asCenterPoint) {
    if (width % 2 || height % 2) {
      throw new Error('`width` and `height` are only numbers divisible by 2');
    }

    x = location.x - width / 2;
    y = location.y - height / 2;
  } else {
    x = location.x;
    y = location.y;
  }

  return rectangleMethods.createNewRectangleState({ x, y, width, height });
};

/**
 * Returns the upper left position of the coordinate
 */
const coordinateToLocation = (coordinate/*:CoordinateState*/)/*:LocationState*/ => {
  return locationMethods.createNewLocationState(
    STYLES.SQUARE_HEIGHT * coordinate[0],
    STYLES.SQUARE_WIDTH * coordinate[1]
  );
};

const coordinateToRectangle = (coordinate/*:CoordinateState*/)/*:RectangleState*/ => {
  return rectangleMethods.createNewRectangleState({
    x: STYLES.SQUARE_WIDTH * coordinate[1],
    y: STYLES.SQUARE_HEIGHT * coordinate[0],
    width: STYLES.SQUARE_WIDTH,
    height: STYLES.SQUARE_HEIGHT,
  });
};

/**
 * Returns the upper left position of the rectangle
 */
const rectangleToLocation = (rectangle/*:RectangleState*/)/*:LocationState*/ => {
  return locationMethods.createNewLocationState(rectangle.top, rectangle.left);
};

/**
 * Convert the rectangle to a coordinate if possible
 * @throws {Error} The shape and the position of the rectangle does not match any square
 */
const rectangleToCoordinate = (rectangle/*:RectangleState*/)/*:CoordinateState*/ => {
  const { x, y, width, height } = rectangleMethods.toXYWidthHeight(rectangle);

  if (
    x % STYLES.SQUARE_WIDTH ||
    y % STYLES.SQUARE_HEIGHT ||
    width !== STYLES.SQUARE_WIDTH ||
    height !== STYLES.SQUARE_HEIGHT
  ) {
    throw new Error('There is no square that fits this rectangle');
  }

  return coordinateMethods.createNewCoordinateState(
    Math.floor(y / STYLES.SQUARE_HEIGHT),
    Math.floor(x / STYLES.SQUARE_WIDTH)
  );
};

/**
 * Whether the rectangle overlaps the coordinates of which square
 */
const findCoordinatesWhereRectangleOverlaps = (
  rectangle/*:RectangleState*/, endPointCoordinate/*:CoordinateState*/
)/*:CoordinateState[]*/ => {
  const collidedCoordinates = [];

  for (let rowIndex = 0; rowIndex <= endPointCoordinate[0]; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex <= endPointCoordinate[1]; columnIndex += 1) {
      const coordinate = coordinateMethods.createNewCoordinateState(rowIndex, columnIndex);
      if (areBoxesOverlapping(rectangle, coordinateToRectangle(coordinate))) {
        collidedCoordinates.push(coordinate);
      }
    }
  }

  return collidedCoordinates;
};

/**
 * @todo Remove overflowed coordinates from result(?)
 */
const createReachableRectangles = (
  centerSquareLocation/*:LocationState*/, reach/*:number*/
)/*:RectangleState[]*/ => {
  return expandReachToRelativeCoordinates(0, reach)
    .map(relativeCoordinate =>
      locationMethods.addLocations(centerSquareLocation, coordinateToLocation(relativeCoordinate))
    )
    .map(location => locationToRectangle(location))
  ;
};


module.exports = {
  coordinateToLocation,
  coordinateToRectangle,
  createReachableRectangles,
  findCoordinatesWhereRectangleOverlaps,
  locationToCoordinate,
  locationToRectangle,
  rectangleToCoordinate,
  rectangleToLocation,
};
