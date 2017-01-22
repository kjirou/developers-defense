const assert = require('power-assert');

const {
  _expandEffectRangeToRelativeCoordinates,
  ACT_IDS,
  actList,
  acts,
  baseAct,
} = require('../../src/immutable/acts');
const { ACT_EFFECT_RANGE_TYPES } = require('../../src/immutable/constants');


describe('immutable/acts', () => {
  describe('_expandEffectRangeToRelativeCoordinates', () => {
    context('ACT_EFFECT_RANGE_TYPES.BALL', () => {
      it('can execute correctly', () => {
        assert.deepStrictEqual(
          _expandEffectRangeToRelativeCoordinates({ type: ACT_EFFECT_RANGE_TYPES.BALL, radius: 1 }),
          [
            [0, 0],
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1],
          ]
        );
      });
    });
  });

  describe('baseAct', () => {
    it('expandEffectRangeToRelativeCoordinates', () => {
      const act = Object.assign({}, baseAct, {
        effectRange: {
          type: ACT_EFFECT_RANGE_TYPES.BALL,
          radius: 0,
        },
      });

      assert.deepStrictEqual(act.expandEffectRangeToRelativeCoordinates(null), [[0, 0]]);
    });
  });

  describe('actList', () => {
    it('should be defined', () => {
      assert(actList.length > 0);
      assert(actList[0].id.length > 0);
    });
  });

  describe('acts', () => {
    it('should be defined', () => {
      const keys = Object.keys(acts);
      assert(keys.length > 0);
      assert(acts[keys[0]].id.length > 0);
    });
  });

  describe('ACT_IDS', () => {
    it('should be defined', () => {
      assert(Object.keys(ACT_IDS).length > 0);
    });
  });
});
