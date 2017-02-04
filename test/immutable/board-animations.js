const assert = require('power-assert');

const {
  BOARD_ANIMATION_IDS,
  boardAnimationList,
  boardAnimations,
} = require('../../src/immutable/board-animations');
const {} = require('../../src/immutable/constants');


describe('immutable/board-animations', () => {
  describe('boardAnimationList', () => {
    it('should be defined', () => {
      assert(boardAnimationList.length > 0);
      assert(boardAnimationList[0].id.length > 0);
    });
  });

  describe('boardAnimations', () => {
    it('should be defined', () => {
      const keys = Object.keys(boardAnimations);
      assert(keys.length > 0);
      assert(boardAnimations[keys[0]].id.length > 0);
    });
  });

  describe('BOARD_ANIMATION_IDS', () => {
    it('should be defined', () => {
      assert(Object.keys(BOARD_ANIMATION_IDS).length > 0);
    });
  });
});
