const assert = require('power-assert');

const { STYLES } = require('../../src/immutable/constants');
const coordinateMethods = require('../../src/state-models/coordinate');
const locationMethods = require('../../src/state-models/location');
const {
  coordinateToRectangle,
  coordinateToLocationOfSquare,
  createReachableRects,
  createRectangleWithLocationAsCenterPoint,
  detectAllCollisionsBetweenRectangleAndCoordinate,
} = require('../../src/state-models/geometric-apis');
const rectangleMethods = require('../../src/state-models/rectangle');


describe('state-models/geometric-apis', () => {
  const _loc = locationMethods.createNewLocationState;
  const _rect = rectangleMethods.createNewRectangleState;


  describe('createRectangleWithLocationAsCenterPoint', () => {
    it('can execute correctly', () => {
      assert.deepStrictEqual(
        createRectangleWithLocationAsCenterPoint(_loc(0, 0), 2, 4),
        _rect({ x: -1, y: -2, width: 2, height: 4 })
      );
    });

    it('should throw an error if `width` or `height` can be divided by 2', () => {
      assert.throws(() => {
        createRectangleWithLocationAsCenterPoint(_loc(0, 0), 2, 3);
      }, /divisible/);
      assert.throws(() => {
        createRectangleWithLocationAsCenterPoint(_loc(0, 0), 1, 4);
      }, /divisible/);
    });
  });

  describe('coordinateToLocationOfSquare', () => {
    it('can execute correctly', () => {
      assert.deepStrictEqual(
        coordinateToLocationOfSquare(coordinateMethods.createNewCoordinateState(0, 0)),
        locationMethods.createNewLocationState(0, 0)
      );

      assert.deepStrictEqual(
        coordinateToLocationOfSquare(coordinateMethods.createNewCoordinateState(1, 2)),
        locationMethods.createNewLocationState(48, 96)
      );
    });
  });

  describe('coordinateToRectangle', () => {
    it('can execute correctly', () => {
      assert.deepStrictEqual(
        coordinateToRectangle(coordinateMethods.createNewCoordinateState(0, 0)),
        _rect({
          top: 0,
          left: 0,
          bottom: 48,
          right: 48,
        })
      );

      assert.deepStrictEqual(
        coordinateToRectangle(coordinateMethods.createNewCoordinateState(1, 2)),
        _rect({
          top: 48,
          left: 96,
          bottom: 96,
          right: 144,
        })
      );
    });
  });

  describe('detectAllCollisionsBetweenRectangleAndCoordinate', () => {
    it('can execute correctly', () => {
      //  o | - | -
      // ---+---+---
      //  - | - | -
      // ---+---+---
      //  - | - | -
      assert.deepStrictEqual(
        detectAllCollisionsBetweenRectangleAndCoordinate(
          rectangleMethods.createNewRectangleState({ x: 0, y: 0, width: 48, height: 48 }),
          coordinateMethods.createNewCoordinateState(2, 2)
        ),
        [
          coordinateMethods.createNewCoordinateState(0, 0),
        ]
      );

      //  o | o | -
      // ---+---+---
      //  - | - | -
      // ---+---+---
      //  - | - | -
      assert.deepStrictEqual(
        detectAllCollisionsBetweenRectangleAndCoordinate(
          rectangleMethods.createNewRectangleState({ x: 1, y: 0, width: 48, height: 48 }),
          coordinateMethods.createNewCoordinateState(2, 2)
        ),
        [
          coordinateMethods.createNewCoordinateState(0, 0),
          coordinateMethods.createNewCoordinateState(0, 1),
        ]
      );

      //  - | - | -
      // ---+---+---
      //  - | o | -
      // ---+---+---
      //  - | - | -
      assert.deepStrictEqual(
        detectAllCollisionsBetweenRectangleAndCoordinate(
          rectangleMethods.createNewRectangleState({ x: 48, y: 48, width: 48, height: 48 }),
          coordinateMethods.createNewCoordinateState(2, 2)
        ),
        [
          coordinateMethods.createNewCoordinateState(1, 1),
        ]
      );

      //  - | - | -
      // ---+---+---
      //  - | - | -
      // ---+---+---
      //  - | o | o
      assert.deepStrictEqual(
        detectAllCollisionsBetweenRectangleAndCoordinate(
          rectangleMethods.createNewRectangleState({ x: 95, y: 96, width: 48, height: 48 }),
          coordinateMethods.createNewCoordinateState(2, 2)
        ),
        [
          coordinateMethods.createNewCoordinateState(2, 1),
          coordinateMethods.createNewCoordinateState(2, 2),
        ]
      );

      //  - | - | -
      // ---+---+---
      //  o | o | -
      // ---+---+---
      //  o | o | -
      assert.deepStrictEqual(
        detectAllCollisionsBetweenRectangleAndCoordinate(
          rectangleMethods.createNewRectangleState({ x: 24, y: 72, width: 48, height: 48 }),
          coordinateMethods.createNewCoordinateState(2, 2)
        ),
        [
          coordinateMethods.createNewCoordinateState(1, 0),
          coordinateMethods.createNewCoordinateState(1, 1),
          coordinateMethods.createNewCoordinateState(2, 0),
          coordinateMethods.createNewCoordinateState(2, 1),
        ]
      );

      //  - | - |
      // ---+---+
      //  - | o | x
      // ---+---+
      //      x   x
      assert.deepStrictEqual(
        detectAllCollisionsBetweenRectangleAndCoordinate(
          rectangleMethods.createNewRectangleState({ x: 49, y: 49, width: 48, height: 48 }),
          coordinateMethods.createNewCoordinateState(1, 1)
        ),
        [
          coordinateMethods.createNewCoordinateState(1, 1),
        ]
      );
    });
  });

  describe('createReachableRects', () => {
    it('can execute correctly', () => {
      assert.deepStrictEqual(
        createReachableRects(locationMethods.createNewLocationState(0, 0), 0),
        [
          _rect({ x: 0, y: 0, width: 48, height: 48 }),
        ]
      );

      assert.deepStrictEqual(
        createReachableRects(locationMethods.createNewLocationState(0, 0), 1),
        [
          _rect({ x: 0, y: 0, width: 48, height: 48 }),
          _rect({ x: 0, y: -48, width: 48, height: 48 }),
          _rect({ x: 48, y: 0, width: 48, height: 48 }),
          _rect({ x: 0, y: 48, width: 48, height: 48 }),
          _rect({ x: -48, y: 0, width: 48, height: 48 }),
        ]
      );

      assert.deepStrictEqual(
        createReachableRects(locationMethods.createNewLocationState(100, 150), 0),
        [
          _rect({ x: 150, y: 100, width: 48, height: 48 }),
        ]
      );
    });
  });
});
