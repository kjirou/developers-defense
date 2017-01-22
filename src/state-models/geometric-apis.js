/** @module */
const { areBoxesOverlapping } = require('box-overlap');

const { STYLES } = require('../immutable/constants');
const { expandReachToRelativeCoordinates } = require('../lib/core');
const coordinateMethods = require('./coordinate');
const locationMethods = require('./location');
const rectangleMethods = require('./rectangle');


/**
 * Where is the location as coordinates
 * @param {State~Location} location
 * @return {State~Coordinate}
 * @throws {Error} If clearly invalid as coordinate
 */
const locationToCoordinate = (location) => {
  return coordinateMethods.createNewCoordinateState(
    Math.floor(location.y / STYLES.SQUARE_HEIGHT),
    Math.floor(location.x / STYLES.SQUARE_WIDTH)
  );
};

/**
 * Generate a rectangle starting from a location
 * @param {State~Location} location
 * @param {(Object|undefined)} options
 * @return {State~Rectangle}
 * @throws {Error} The width and the height are not divisible if `asCenterPoint` is specified.
 */
const locationToRectangle = (location, options = {}) => {
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
 * @param {State~Coordinate} coordinate
 * @return {State~Location}
 */
const coordinateToLocation = (coordinate) => {
  return locationMethods.createNewLocationState(
    STYLES.SQUARE_HEIGHT * coordinate[0],
    STYLES.SQUARE_WIDTH * coordinate[1]
  );
};

/**
 * @param {State~Coordinate} coordinate
 * @return {State~Rectangle}
 */
const coordinateToRectangle = (coordinate) => {
  return rectangleMethods.createNewRectangleState({
    x: STYLES.SQUARE_WIDTH * coordinate[1],
    y: STYLES.SQUARE_HEIGHT * coordinate[0],
    width: STYLES.SQUARE_WIDTH,
    height: STYLES.SQUARE_HEIGHT,
  });
};

/**
 * Returns the upper left position of the rectangle
 * @param {State~Rectangle} rectangle
 * @return {State~Location}
 */
const rectangleToLocation = (rectangle) => {
  return locationMethods.createNewLocationState(rectangle.top, rectangle.left);
};

/**
 * Convert the rectangle to a coordinate if possible
 * @param {State~Rectangle} rectangle
 * @return {State~Coordinate}
 * @throws {Error} The shape and the position of the rectangle does not match any square
 */
const rectangleToCoordinate = (rectangle) => {
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
 * @param {State~Rectangle} rectangle
 * @param {State~Coordinate} endPointCoordinate
 * @return {State~Coordinate[]}
 */
const findCoordinatesWhereRectangleOverlaps = (rectangle, endPointCoordinate) => {
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
const createReachableRectangles = (centerSquareLocation, reach) => {
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
