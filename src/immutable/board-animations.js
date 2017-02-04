/**
 * @typedef {Object} Immutable~BoardAnimation
 */


/** @module */
const dictify = require('dictify');
const keymirror = require('keymirror');

const { BOARD_ANIMATION_EXPRESSION_TYPES, STYLES } = require('./constants');


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
      classNames: ['square_based_animation', 'square_based_animation--shock-blue'],
    },
    duration: 750,
  },
  {
    id: 'SHOCK_RED',
    expression: {
      type: 'SQUARE_BASED',
      classNames: ['square_based_animation', 'square_based_animation--shock-red'],
    },
    duration: 750,
  },
];


const expressionDefaults = {
  classNames: [],
  style: '',
};

const baseBoardAnimation = {
  getAnimationDurationClassName() {
    return `animation-duration-${ this.duration }ms`;
  },
};

const boardAnimationList = fixtures.map(fixture => {
  // `duration` has some constraints for CSS
  if (
    !fixture.id ||
    !fixture.expression ||
    fixture.duration === undefined ||
    fixture.duration % 50 !== 0 ||
    fixture.duration < 0 ||
    fixture.duration > STYLES.MAX_ANIMATION_DURATION
  ) {
    throw new Error(`boardAnimation's fixture.id="${ fixture.id }" is invalid`);
  }

  const expression = Object.assign({}, expressionDefaults, fixture.expression);
  const boardAnimation =  Object.assign({}, baseBoardAnimation, fixture, { expression });

  return boardAnimation;
});
const boardAnimations = dictify(boardAnimationList, 'id');
const BOARD_ANIMATION_IDS = keymirror(boardAnimations);


module.exports = {
  BOARD_ANIMATION_IDS,
  boardAnimationList,
  boardAnimations,
};
