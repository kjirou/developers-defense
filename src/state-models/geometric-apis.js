/** @module */
const { areBoxesOverlapping } = require('box-overlap');

const { STYLES } = require('../immutable/constants');
const { expandReachToRelativeCoordinates } = require('../lib/core');
const coordinateMethods = require('./coordinate');
const locationMethods = require('./location');
const rectangleMethods = require('./rectangle');


/**
 * @param {State~Location} location
 * @return {State~Rectangle}
 */
const createSquareSizeRectangleFromLocation = (location) => {
  return rectangleMethods.createNewRectangleState({
    x: location.x,
    y: location.y,
    width: STYLES.SQUARE_WIDTH,
    height: STYLES.SQUARE_HEIGHT,
  });
};

/**
 * Create a rectangle with the location as the center point
 * @param {State~Location} location
 * @param {number} width - Only numbers divisible by 2
 * @param {number} height - Only numbers divisible by 2
 * @return {State~Rectangle}
 */
const createRectangleWithLocationAsCenterPoint = (location, width, height) => {
  if (width % 2 || height % 2) {
    throw new Error('`width` and `height` are only numbers divisible by 2');
  }

  return rectangleMethods.createNewRectangleState({
    x: location.x - width / 2,
    y: location.y - height / 2,
    width,
    height,
  });
};

/**
 * @param {State~Coordinate} coordinate
 * @return {State~Location}
 */
const coordinateToLocationOfSquare = (coordinate) => {
  return locationMethods.createNewLocationState(
    coordinate[0] * STYLES.SQUARE_HEIGHT, coordinate[1] * STYLES.SQUARE_WIDTH);
};

/**
 * @param {State~Coordinate} coordinate
 * @return {State~Rectangle}
 */
const coordinateToRectangle = (coordinate) => {
  return createSquareSizeRectangleFromLocation(coordinateToLocationOfSquare(coordinate));
};

/**
 * @param {State~Location} location
 * @return {State~Coordinate}
 */
const findCoordinateByLocation = (location) => {
  return coordinateMethods.createNewCoordinateState(
    Math.floor(location.y / STYLES.SQUARE_HEIGHT),
    Math.floor(location.x / STYLES.SQUARE_WIDTH)
  );
};

/**
 * Detect collisions between rectangle and coordinate,
 *   assuming that the size of the square-matrix is infinite.
 * @param {State~Rectangle} rectangle
 * @param {State~Coordinate} endPointCoordinate
 * @return {State~Coordinate[]}
 */
const detectAllCollisionsBetweenRectangleAndCoordinate = (rectangle, endPointCoordinate) => {
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
 * @param {State~Location} centerSquareLocation
 * @param {number} reach - A integer >= 0
 * @return {State~Rectangle[]}
 * @todo Remove overflowed coordinates from result?
 */
const createReachableRects = (centerSquareLocation, reach) => {
  return expandReachToRelativeCoordinates(0, reach)
    .map(relativeCoordinate =>
      locationMethods.addLocations(centerSquareLocation, coordinateToLocationOfSquare(relativeCoordinate))
    )
    .map(location => createSquareSizeRectangleFromLocation(location));
};


module.exports = {
  coordinateToLocationOfSquare,
  coordinateToRectangle,
  createSquareSizeRectangleFromLocation,
  createReachableRects,
  createRectangleWithLocationAsCenterPoint,
  detectAllCollisionsBetweenRectangleAndCoordinate,
  findCoordinateByLocation,
};
