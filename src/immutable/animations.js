/**
 * Animation definitions what are attached to block-level elements
 * @typedef {Object} Immutable~Animation
 */


/** @module */
const dictify = require('dictify');
const keymirror = require('keymirror');

const { STYLES } = require('./constants');


// TODO: 敵味方/攻撃回復補助でベースカラーを設定したい
// TODO: 方向を持つアニメーションをどうするか
// TODO: Make to validate by using `availableAnimationDestinationTypes`
const fixtures = [
  {
    id: 'NONE',
    position: {
      type: 'NONE',
    },
    expression: {
      availableAnimationDestinationTypes: ['SQUARE', 'UNIT'],
    },
    duration: 0,
  },
  {
    id: 'SHOCK_BLUE',
    expression: {
      availableAnimationDestinationTypes: ['SQUARE', 'UNIT'],
      classNames: ['square_based_animation', 'square_based_animation--shock-blue'],
    },
    duration: 750,
  },
  {
    id: 'SHOCK_RED',
    expression: {
      availableAnimationDestinationTypes: ['SQUARE', 'UNIT'],
      classNames: ['square_based_animation', 'square_based_animation--shock-red'],
    },
    duration: 750,
  },
];


const expressionDefaults = {
  availableAnimationDestinationTypes: [],
  classNames: [],
  style: '',
};

const baseAnimation = {
  /**
   * @return {string}
   */
  _getAnimationDurationClassName() {
    return `animation-duration-${ this.duration }ms`;
  },

  /**
   * @return {string[]}
   */
  getExpressionClassNames() {
    return [
      ...this.expression.classNames,
      this._getAnimationDurationClassName(),
    ];
  },
};

const animationList = fixtures.map(fixture => {
  // `duration` has some constraints for CSS
  if (
    !fixture.id ||
    !fixture.expression ||
    fixture.duration === undefined ||
    fixture.duration % 50 !== 0 ||
    fixture.duration < 0 ||
    fixture.duration > STYLES.MAX_ANIMATION_DURATION
  ) {
    throw new Error(`animation's fixture.id="${ fixture.id }" is invalid`);
  }

  const expression = Object.assign({}, expressionDefaults, fixture.expression);
  const animation =  Object.assign({}, baseAnimation, fixture, { expression });

  return animation;
});
const animations = dictify(animationList, 'id');
const ANIMATION_IDS = keymirror(animations);


module.exports = {
  ANIMATION_IDS,
  animationList,
  animations,
};
