const assert = require('power-assert');

const {
  ANIMATION_IDS,
  animationList,
  animations,
} = require('../../src/immutable/animations');
const {} = require('../../src/immutable/constants');


describe('immutable/animations', () => {
  describe('animationList', () => {
    it('should be defined', () => {
      assert(animationList.length > 0);
      assert(animationList[0].id.length > 0);
    });
  });

  describe('animations', () => {
    it('should be defined', () => {
      const keys = Object.keys(animations);
      assert(keys.length > 0);
      assert(animations[keys[0]].id.length > 0);
    });
  });

  describe('ANIMATION_IDS', () => {
    it('should be defined', () => {
      assert(Object.keys(ANIMATION_IDS).length > 0);
    });
  });
});
