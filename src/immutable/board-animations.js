/**
 * @typedef {Object} Immutable~BoardAnimation
 */


/** @module */
const dictify = require('dictify');
const keymirror = require('keymirror');

const { BOARD_ANIMATION_EXPRESSION_TYPES } = require('./constants');


// TODO: 敵味方/攻撃回復補助でベースカラーを設定したい
// TODO: 方向を持つアニメーションをどうするか
const fixtures = [
  {
    id: 'NONE',
    position: {
      type: 'NONE',
    },
    expression: {
      type: 'NONE',
    },
    duration: 0,
  },
  {
    id: 'SHOCK_BLUE',
    expression: {
      type: 'SQUARE_BASED',
      classNames: ['ba', 'ba--shock-blue'],
    },
    duration: 500,
  },
  {
    id: 'SHOCK_RED',
    expression: {
      type: 'SQUARE_BASED',
      classNames: ['ba', 'ba--shock-red'],
    },
    duration: 500,
  },
];


const expressionDefaults = {
  classNames: [],
  style: '',
};
const boardAnimationDefaults = {
};

const boardAnimationList = fixtures.map(fixture => {
  if (
    !fixture.id ||
    !fixture.expression ||
    fixture.duration === undefined
  ) {
    throw new Error(`boardAnimation's fixture.id="${ fixture.id }" is invalid`);
  }

  const expression = Object.assign({}, expressionDefaults, fixture.expression);
  const boardAnimation =  Object.assign({}, boardAnimationDefaults, fixture, { expression });

  return boardAnimation;
});
const boardAnimations = dictify(boardAnimationList, 'id');
const BOARD_ANIMATION_IDS = keymirror(boardAnimations);


module.exports = {
  BOARD_ANIMATION_IDS,
  boardAnimationList,
  boardAnimations,
};
