/**
 * @typedef {Object} Immutable~BoardAnimation
 */


/** @module */
const dictify = require('dictify');
const keymirror = require('keymirror');

const { BOARD_ANIMATION_EXPRESSION_TYPES, BOARD_ANIMATION_POSITION_TYPES } = require('./constants');


// TODO: 方向を持つアニメーションをどうするか
const fixtures = [
  {
    id: 'BLAST_BLUE',
    position: {
      type: 'SQUARE',
    },
    expression: {
      type: 'CSS',
      classNames: ['ba', 'ba--blast-blue'],
    },
  },
  {
    id: 'BLAST_RED',
    position: {
      type: 'SQUARE',
    },
    expression: {
      type: 'CSS',
      classNames: ['ba', 'ba--blast-red'],
    },
  },
  {
    id: 'NONE',
    position: {
      type: 'NONE',
    },
    expression: {
      type: 'NONE',
    },
  },
  {
    id: 'SHOCK_BLUE',
    position: {
      type: 'SQUARE',
    },
    expression: {
      type: 'CSS',
      classNames: ['ba', 'ba--shock-blue'],
    },
  },
  {
    id: 'SHOCK_RED',
    position: {
      type: 'SQUARE',
    },
    expression: {
      type: 'CSS',
      classNames: ['ba', 'ba--shock-red'],
    },
  },
];


const baseBoardAnimation = {
  id: null,
};

const boardAnimationList = fixtures.map(fixture => {
  const boardAnimation =  Object.assign({}, baseBoardAnimation, fixture);

  if (!boardAnimation.id || !boardAnimation.position || !boardAnimation.expression) {
    throw new Error(`boardAnimation.id="${ boardAnimation.id }" is invalid`);
  }

  return boardAnimation;
});
const boardAnimations = dictify(boardAnimationList, 'id');
const BOARD_ANIMATION_IDS = keymirror(boardAnimations);


module.exports = {
  BOARD_ANIMATION_IDS,
  boardAnimationList,
  boardAnimations,
  baseBoardAnimation,
};
