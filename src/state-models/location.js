// TODO: `Location` -> `Point` & `[y,x]` -> {x,y}

/**
 * @typedef {number[]} State~Location
 * @description [y, x] (= [top, left]) position on the battle-board
 */


/** @module */
const createNewLocationState = (y, x) => {
  return [y, x];
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
 * @return {State~Location} [movedY, movedX]
 */
const performPseudoVectorAddition = (initialLocation, terminalLocation, vector) => {
  const [initialY, initialX] = initialLocation;
  const [terminalTop, terminalLeft] = terminalLocation;

  if (initialY !== terminalTop && initialX !== terminalLeft) {
    throw new Error('It is possible to move only up / down / left / right.');
  }

  let movedY = initialY;
  let movedX = initialX;

  if (initialY < terminalTop) {
    movedY = Math.min(terminalTop, initialY + vector);
  } else if (initialY > terminalTop) {
    movedY = Math.max(terminalTop, initialY - vector);
  } else if (initialX < terminalLeft) {
    movedX = Math.min(terminalLeft, initialX + vector);
  } else if (initialX > terminalLeft) {
    movedX = Math.max(terminalLeft, initialX - vector);
  }

  return [movedY, movedX];
};


module.exports = {
  createNewLocationState,
  measureDistance,
  performPseudoVectorAddition,
};
