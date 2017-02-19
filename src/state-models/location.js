// @flow

/*::
import type { LocationState } from '../types/states';
 */

const angles = require('angles');

const { EFFECT_DIRECTIONS, STYLES } = require('../immutable/constants');


const createNewLocationState = (y/*:number*/, x/*:number*/)/*:LocationState*/ => {
  return { y, x };
};

const areSameLocations = (...locations/*:Array<LocationState>*/)/*:boolean*/ => {
  const [first, ...rest] = locations;
  return rest.every(v => first.y === v.y && first.x === v.x);
};

/**
 * Add any locations as vectors
 */
const addLocations = (...locations/*:Array<LocationState>*/)/*:LocationState*/ => {
  const [first, ...rest] = locations;
  let { y, x } = first;
  rest.forEach(v => {
    y += v.y;
    x += v.x;
  });
  return createNewLocationState(y, x);
};

const calculateCenterOfSquare = (squareLocation/*:LocationState*/)/*:LocationState*/ => {
  return addLocations(squareLocation, createNewLocationState(STYLES.SQUARE_HEIGHT / 2, STYLES.SQUARE_WIDTH / 2));
};

const measureDistance = (a/*:LocationState*/, b/*:LocationState*/)/*:number*/ => {
  return Math.sqrt(Math.pow(a.y - b.y, 2) + Math.pow(a.x - b.x, 2));
};

/**
 * Measure the angle of the line with the top as 0
 * @example from(0, 0) / to(-1, 0) -> 0
 *          from(0, 0) / to(-1, 1) -> 45
 *          from(0, 0) / to(0, 1)  -> 90
 *          from(0, 0) / to(1, 0)  -> 180
 *          from(0, 0) / to(0, -1) -> 270
 *          from(0, 0) / to(0, 0)  -> null
 */
const measureAngleWithTopAsZero = (from/*:LocationState*/, to/*:LocationState*/)/*:?number*/ => {
  if (areSameLocations(from, to)) return null;
  return angles.normalize(angles.fromSlope([from.x, from.y], [to.x, to.y]) - 270);
};

/**
 * TODO: enum
 * Returns One of EFFECT_DIRECTIONS or null
 */
const measureAngleAsEffectDirection = (from/*:LocationState*/, to/*:LocationState*/)/*:?string*/ => {
  const angle = measureAngleWithTopAsZero(from, to);

  // from == to
  if (angle === null || angle === undefined) {
    return EFFECT_DIRECTIONS.NONE;
  } else if (
    315 <= angle && angle < 360 ||
    0 <= angle && angle < 45
  ) {
    return EFFECT_DIRECTIONS.UP;
  } else if (
    45 <= angle && angle < 135
  ) {
    return EFFECT_DIRECTIONS.RIGHT;
  } else if (
    135 <= angle && angle < 225
  ) {
    return EFFECT_DIRECTIONS.DOWN;
  } else if (
    225 <= angle && angle < 315
  ) {
    return EFFECT_DIRECTIONS.LEFT;
  }

  throw new Error(`Invalid angle=${ angle }`);
};

/**
 * ベクトルの和を行うが、方向は上下左右に限定する。
 * 大量に呼び出されるので処理の速さに配慮する。
 * @todo Memoize?
 */
const performPseudoVectorAddition = (
  initial/*:LocationState*/, terminal/*:LocationState*/, scalar/*:number*/)/*:LocationState*/ => {
  // 移動が4方向限定なのは、進行方向以外に座標の端数を出さないことの担保をするためでもある。
  // 例えば横軸が 0.1px ずれたまま縦移動をした場合、ユニットサイズはマス目サイズと同じなため、
  // マス目ベースの当たり判定が横軸 2 マスになってしまう。
  if (initial.y !== terminal.y && initial.x !== terminal.x) {
    throw new Error('It is possible to move only up / down / left / right.');
  }

  let movedY = initial.y;
  let movedX = initial.x;

  if (initial.y < terminal.y) {
    movedY = Math.min(terminal.y, initial.y + scalar);
  } else if (initial.y > terminal.y) {
    movedY = Math.max(terminal.y, initial.y - scalar);
  } else if (initial.x < terminal.x) {
    movedX = Math.min(terminal.x, initial.x + scalar);
  } else if (initial.x > terminal.x) {
    movedX = Math.max(terminal.x, initial.x - scalar);
  }

  return createNewLocationState(movedY, movedX);
};


module.exports = {
  addLocations,
  areSameLocations,
  calculateCenterOfSquare,
  createNewLocationState,
  measureAngleAsEffectDirection,
  measureAngleWithTopAsZero,
  measureDistance,
  performPseudoVectorAddition,
};
