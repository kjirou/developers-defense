/**
 * @typedef {Object} State~Location
 * @description A position on the battle-board
 * @property {number} y - A distance from top to bottom. In other words in CSS terms is "top".
 * @property {number} x - A distance from left to right. In other words in CSS terms is "left".
 */


/** @module */
const angles = require('angles');

const { STYLES } = require('../immutable/constants');


const createNewLocationState = (y, x) => {
  return { y, x };
};

/**
 * @param {...State~Location} locations
 * @return {boolean}
 */
const areSameLocations = (...locations) => {
  const [first, ...rest] = locations;
  return rest.every(v => first.y === v.y && first.x === v.x);
};

/**
 * Add any locations as vectors
 * @param {...State~Location} locations
 * @return {State~Location}
 */
const addLocations = (...locations) => {
  const [first, ...rest] = locations;
  let { y, x } = first;
  rest.forEach(v => {
    y += v.y;
    x += v.x;
  });
  return createNewLocationState(y, x);
};

/**
 * @param {...State~Location} squareLocation
 * @return {State~Location}
 */
const calculateCenterOfSquare = (squareLocation) => {
  return addLocations(squareLocation, createNewLocationState(STYLES.SQUARE_HEIGHT / 2, STYLES.SQUARE_WIDTH / 2));
};

/**
 * @param {State~Location} a
 * @param {State~Location} b
 * @return {number}
 */
const measureDistance = (a, b) => {
  return Math.sqrt(Math.pow(a.y - b.y, 2) + Math.pow(a.x - b.x, 2));
};

/**
 * Measure the angle of the line with the top as 0
 * @param {State~Location} from
 * @param {State~Location} to
 * @return {?number} ex) from(0, 0) / to(-1, 0) -> 0
 *                       from(0, 0) / to(-1, 1) -> 45
 *                       from(0, 0) / to(0, 1)  -> 90
 *                       from(0, 0) / to(1, 0)  -> 180
 *                       from(0, 0) / to(0, -1) -> 270
 *                       from(0, 0) / to(0, 0)  -> null
 */
const measureAngleWithTopAsZero = (from, to) => {
  if (areSameLocations(from, to)) return null;
  return angles.normalize(angles.fromSlope([from.x, from.y], [to.x, to.y]) - 270);
};

/**
 * ベクトルの和を行うが、方向は上下左右に限定する。
 * 大量に呼び出されるので処理の速さに配慮する。
 * @param {State~Location} initial
 * @param {State~Location} terminal
 * @param {number} scalar
 * @todo Memoize?
 * @return {State~Location} { y: movedY, x: movedX }
 */
const performPseudoVectorAddition = (initial, terminal, scalar) => {
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
  measureAngleWithTopAsZero,
  measureDistance,
  performPseudoVectorAddition,
};
