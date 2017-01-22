const assert = require('power-assert');

const { STYLES } = require('../../src/immutable/constants');
const coordinateMethods = require('../../src/state-models/coordinate');
const locationMethods = require('../../src/state-models/location');
const {
  coordinateToLocation,
  coordinateToRectangle,
  createReachableRectangles,
  findCoordinatesWhereRectangleOverlaps,
  locationToCoordinate,
  locationToRectangle,
  rectangleToCoordinate,
  rectangleToLocation,
} = require('../../src/state-models/geometric-apis');
const rectangleMethods = require('../../src/state-models/rectangle');


describe('state-models/geometric-apis', () => {
  const _loc = locationMethods.createNewLocationState;
  const _coord = coordinateMethods.createNewCoordinateState;
  const _rect = rectangleMethods.createNewRectangleState;


  describe('locationToCoordinate', () => {
    it('can execute correctly', () => {
      assert.deepStrictEqual(
        locationToCoordinate(_loc(0, 0)),
        _coord(0, 0)
      );
      assert.deepStrictEqual(
        locationToCoordinate(_loc(48, 96)),
        _coord(1, 2)
      );
      assert.deepStrictEqual(
        locationToCoordinate(_loc(47.9, 95.9)),
        _coord(0, 1)
      );
      assert.throws(() => {
        locationToCoordinate(_loc(-0.1, 1));
      }, /negative/i);
    });
  });

  describe('locationToRectangle', () => {
    it('can create a square-sized rectangle from upper left', () => {
      assert.deepStrictEqual(
        locationToRectangle(_loc(1, 2)),
        _rect({ x: 2, y: 1, width: 48, height: 48 })
      );
    });

    it('can create a square-sized rectangle from center', () => {
      assert.deepStrictEqual(
        locationToRectangle(_loc(24, 48), { asCenterPoint: true }),
        _rect({ x: 24, y: 0, width: 48, height: 48 })
      );
    });

    it('can create a rectangle with size specification', () => {
      assert.deepStrictEqual(
        locationToRectangle(_loc(1, 2), { width: 1, height: 2 }),
        _rect({ x: 2, y: 1, width: 1, height: 2 })
      );
    });

    it('should throw an error if the coordinate of the center point are fractions', () => {
      assert.throws(() => {
        locationToRectangle(_loc(0, 0), { width: 47, asCenterPoint: true });
      }, /divisible/);
    });
  });

  describe('coordinateToLocation', () => {
    it('can execute correctly', () => {
      assert.deepStrictEqual(
        coordinateToLocation(_coord(2, 1)),
        _loc(96, 48)
      );
    });
  });

  describe('coordinateToRectangle', () => {
    it('can execute correctly', () => {
      assert.deepStrictEqual(
        coordinateToRectangle(_coord(2, 1)),
        _rect({ x: 48, y: 96, width: 48, height: 48 })
      );
    });
  });

  describe('rectangleToLocation', () => {
    it('can execute correctly', () => {
      assert.deepStrictEqual(
        rectangleToLocation(_rect({ x: 1, y: 2, width: 3, height: 4 })),
        _loc(2, 1)
      );
    });
  });

  describe('rectangleToCoordinate', () => {
    it('can execute correctly', () => {
      assert.deepStrictEqual(
        rectangleToCoordinate(_rect({ x: 48, y: 96, width: 48, height: 48 })),
        _coord(2, 1)
      );
      assert.throws(() => {
        rectangleToCoordinate(_rect({ x: 49, y: 96, width: 48, height: 48 }));
      }, /no square/);
      assert.throws(() => {
        rectangleToCoordinate(_rect({ x: 48, y: 97, width: 48, height: 48 }));
      }, /no square/);
      assert.throws(() => {
        rectangleToCoordinate(_rect({ x: 48, y: 96, width: 49, height: 48 }));
      }, /no square/);
      assert.throws(() => {
        rectangleToCoordinate(_rect({ x: 48, y: 96, width: 48, height: 49 }));
      }, /no square/);
    });
  });

  describe('findCoordinatesWhereRectangleOverlaps', () => {
    it('can execute correctly', () => {
      //  o | - | -
      // ---+---+---
      //  - | - | -
      // ---+---+---
      //  - | - | -
      assert.deepStrictEqual(
        findCoordinatesWhereRectangleOverlaps(
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
        findCoordinatesWhereRectangleOverlaps(
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
        findCoordinatesWhereRectangleOverlaps(
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
        findCoordinatesWhereRectangleOverlaps(
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
        findCoordinatesWhereRectangleOverlaps(
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
        findCoordinatesWhereRectangleOverlaps(
          rectangleMethods.createNewRectangleState({ x: 49, y: 49, width: 48, height: 48 }),
          coordinateMethods.createNewCoordinateState(1, 1)
        ),
        [
          coordinateMethods.createNewCoordinateState(1, 1),
        ]
      );
    });
  });

  describe('createReachableRectangles', () => {
    it('can execute correctly', () => {
      assert.deepStrictEqual(
        createReachableRectangles(locationMethods.createNewLocationState(0, 0), 0),
        [
          _rect({ x: 0, y: 0, width: 48, height: 48 }),
        ]
      );

      assert.deepStrictEqual(
        createReachableRectangles(locationMethods.createNewLocationState(0, 0), 1),
        [
          _rect({ x: 0, y: 0, width: 48, height: 48 }),
          _rect({ x: 0, y: -48, width: 48, height: 48 }),
          _rect({ x: 48, y: 0, width: 48, height: 48 }),
          _rect({ x: 0, y: 48, width: 48, height: 48 }),
          _rect({ x: -48, y: 0, width: 48, height: 48 }),
        ]
      );

      assert.deepStrictEqual(
        createReachableRectangles(locationMethods.createNewLocationState(100, 150), 0),
        [
          _rect({ x: 150, y: 100, width: 48, height: 48 }),
        ]
      );
    });
  });
});
