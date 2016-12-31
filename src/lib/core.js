/** @module */

const cloneViaJson = (value) => {
  return JSON.parse(JSON.stringify(value));
};

/**
 * @param {Array[]} a
 * @param {Array[]} b
 * @return {boolean}
 */
const areSameSize2DArray = (a, b) => {
  if (a.length !== b.length) return false;

  for (let rowIndex = 0; rowIndex < a.length; rowIndex += 1) {
    if (a[rowIndex].length !== b[rowIndex].length) return false;
  }

  return true;
};

/**
 * ベクトルの和を行うが、方向は上下左右に限定する。
 * 大量に呼び出されるので処理の速さを優先する。
 * @return {number[]} [movedX, movedY]
 */
const performPseudoVectorAddition = (initialX, initialY, terminalX, terminalY, vector) => {
  if (initialX !== terminalX && initialY !== terminalY) {
    throw new Error('It is possible to move only up / down / left / right.');
  }

  let movedX = initialX;
  let movedY = initialY;

  if (initialX < terminalX) {
    movedX = Math.min(terminalX, initialX + vector);
  } else if (initialX > terminalX) {
    movedX = Math.min(initialX, terminalX + vector);
  } else if (initialY < terminalY) {
    movedY = Math.min(terminalY, initialY + vector);
  } else if (initialY > terminalY) {
    movedY = Math.min(initialY, terminalY + vector);
  }

  return [movedX, movedY];
};


module.exports = {
  areSameSize2DArray,
  cloneViaJson,
  performPseudoVectorAddition,
};
