const assert = require('power-assert');

const {
  createNewRectangleState,
  toXYWidthHeight,
} = require('../../src/state-models/rectangle');


describe('state-models/rectangle', () => {
  describe('createNewRectangleState', () => {
    it('can parse `{top, right, bottom, left}`', () => {
      assert.deepStrictEqual(createNewRectangleState({ top: 1, right: 12, bottom: 2, left: 11 }), {
        top: 1,
        right: 12,
        bottom: 2,
        left: 11,
      });
    });

    it('can parse `{x, y, width, height}`', () => {
      assert.deepStrictEqual(createNewRectangleState({ x: 1, y: 2, width: 10, height: 20 }), {
        top: 2,
        right: 11,
        bottom: 22,
        left: 1,
      });
    });

    it('should throw a error if `{top, right, bottom, left}` and `{x, y, width, height}` are mixed', () => {
      assert.throws(() => {
        createNewRectangleState({ top: 1, right: 12, bottom: 2, left: 11, x: 1 });
      }, /mixed/);
      assert.throws(() => {
        createNewRectangleState({ x: 1, y: 2, width: 3, height: 4, top: 1 });
      }, /mixed/);
    });

    it('should throw a error if bottom is less than top', () => {
      assert.throws(() => {
        createNewRectangleState({ top: 100, right: 12, bottom: 2, left: 11 });
      }, /less than/);
    });

    it('should throw a error if right is less than left', () => {
      assert.throws(() => {
        createNewRectangleState({ top: 1, right: 12, bottom: 2, left: 110 });
      }, /less than/);
    });
  });

  describe('toXYWidthHeight', () => {
    it('can execute correctly', () => {
      const rect = createNewRectangleState({ top: 1, right: 12, bottom: 2, left: 11 });
      assert.deepStrictEqual(
        toXYWidthHeight(
          createNewRectangleState({ top: 1, right: 12, bottom: 2, left: 11 })
        ),
        {
          y: 1,
          x: 11,
          width: 1,
          height: 1,
        }
      );
    });
  });
});
