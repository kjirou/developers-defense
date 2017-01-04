/**
 * @typedef {number[]} State~Location
 * @description [top, left] position on the battle-board
 */


/** @module */
const createNewLocationState = (top, left) => {
  return [top, left];
};

/**
 * @param {State~Location} a
 * @param {State~Location} b
 * @return {number}
 */
const measureDistance = (a, b) => {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
};

/**
 * ベクトルの和を行うが、方向は上下左右に限定する。
 * 大量に呼び出されるので処理の速さを優先する。
 * @param {State~Location} initialLocation
 * @param {State~Location} terminalLocation
 * @param {number} vector
 * @return {State~Location} [movedTop, movedLeft]
 */
const performPseudoVectorAddition = (initialLocation, terminalLocation, vector) => {
  const [initialTop, initialLeft] = initialLocation;
  const [terminalTop, terminalLeft] = terminalLocation;

  if (initialTop !== terminalTop && initialLeft !== terminalLeft) {
    throw new Error('It is possible to move only up / down / left / right.');
  }

  let movedTop = initialTop;
  let movedLeft = initialLeft;

  if (initialTop < terminalTop) {
    movedTop = Math.min(terminalTop, initialTop + vector);
  } else if (initialTop > terminalTop) {
    movedTop = Math.max(terminalTop, initialTop - vector);
  } else if (initialLeft < terminalLeft) {
    movedLeft = Math.min(terminalLeft, initialLeft + vector);
  } else if (initialLeft > terminalLeft) {
    movedLeft = Math.max(terminalLeft, initialLeft - vector);
  }

  return [movedTop, movedLeft];
};


module.exports = {
  createNewLocationState,
  measureDistance,
  performPseudoVectorAddition,
};
