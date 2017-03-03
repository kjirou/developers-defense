// @flow

/*::
import type { AnimationDestinationType } from './constants';
 */

const keyBy = require('lodash.keyby');
const keymirror = require('keymirror');

const { STYLES } = require('./constants');


// TODO: 敵味方/攻撃回復補助でベースカラーを設定したい
// TODO: 方向を持つアニメーションをどうするか
// TODO: Make to validate by using `availableAnimationDestinationTypes`

/*::
//
// Animation definitions what are attached to block-level elements
//
export type AnimationImmutableObject = {
  id: string,
  expression: {
    availableAnimationDestinationTypes: AnimationDestinationType[],
    classNames: string[],
    style: string,
  },
  duration: number,
};
 */

const fixtures = [
  {
    id: 'NONE',
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
  _getAnimationDurationClassName()/*:string*/ {
    return `animation-duration-${ this.duration }ms`;
  },

  getExpressionClassNames()/*:string[]*/ {
    return [
      ...this.expression.classNames,
      this._getAnimationDurationClassName(),
    ];
  },
};

const fixtureToAnimation = (fixture/*:Object*/)/*:AnimationImmutableObject*/ => {
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
};

const animationList/*:AnimationImmutableObject[]*/ = fixtures.map(fixtureToAnimation);
const animations/*:{[id:string]: AnimationImmutableObject}*/ = keyBy(animationList, 'id');
const ANIMATION_IDS/*:{[id:string]: string}*/ = keymirror(animations);


module.exports = {
  ANIMATION_IDS,
  animationList,
  animations,
};
