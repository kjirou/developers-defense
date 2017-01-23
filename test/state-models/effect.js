const assert = require('power-assert');

const { createNewCoordinateState } = require('../../src/state-models/coordinate');
const {
  createEffectiveRectangles,
  createNewEffectState,
} = require('../../src/state-models/effect');
const { createNewLocationState } = require('../../src/state-models/location');
const { createNewRectangleState } = require('../../src/state-models/rectangle');


describe('state-models/effect', () => {
  describe('createEffectiveRectangles', () => {
    it('should return [] if the effect does not have `relativeCoordinates`', () => {
      const effect = createNewEffectState([], createNewLocationState(0, 0), { aimedUnitUid: 'a' });

      assert.deepStrictEqual(createEffectiveRectangles(effect), []);
    });

    it('can create rectangles from relative coordinates', () => {
      const effect = createNewEffectState([], createNewLocationState(48, 96), {
        relativeCoordinates: [[-1, 0], [0, 1], [1, 0], [0, -1]],
      });

      assert.deepStrictEqual(
        createEffectiveRectangles(effect),
        [
          createNewRectangleState({ x: 96, y: 0, width: 48, height: 48 }),
          createNewRectangleState({ x: 144, y: 48, width: 48, height: 48 }),
          createNewRectangleState({ x: 96, y: 96, width: 48, height: 48 }),
          createNewRectangleState({ x: 48, y: 48, width: 48, height: 48 }),
        ]
      );
    });

    it('should adjust the impacted location to a coordinate', () => {
      const effect = createNewEffectState([], createNewLocationState(47.9, 95.9), {
        relativeCoordinates: [[0 ,0]],
      });

      assert.deepStrictEqual(
        createEffectiveRectangles(effect),
        [
          createNewRectangleState({ x: 48, y: 0, width: 48, height: 48 }),
        ]
      );
    });

    it('should cut off negative value coordinates', () => {
      const effect = createNewEffectState([], createNewLocationState(0, 0), {
        relativeCoordinates: [[-1 ,0], [0, -1], [0, 0]],
      });

      assert.deepStrictEqual(
        createEffectiveRectangles(effect),
        [
          createNewRectangleState({ x: 0, y: 0, width: 48, height: 48 }),
        ]
      );
    });
  });
});
