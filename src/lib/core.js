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
 * @return {number[]} [movedTop, movedLeft]
 */
const performPseudoVectorAddition = (initialTop, initialLeft, terminalTop, terminalLeft, vector) => {
  if (initialTop !== terminalTop && initialLeft !== terminalLeft) {
    throw new Error('It is possible to move only up / down / left / right.');
  }

  let movedTop = initialTop;
  let movedLeft = initialLeft;

  if (initialTop < terminalTop) {
    movedTop = Math.min(terminalTop, initialTop + vector);
  } else if (initialTop > terminalTop) {
    movedTop = Math.min(initialTop, terminalTop + vector);
  } else if (initialLeft < terminalLeft) {
    movedLeft = Math.min(terminalLeft, initialLeft + vector);
  } else if (initialLeft > terminalLeft) {
    movedLeft = Math.min(initialLeft, terminalLeft + vector);
  }

  return [movedTop, movedLeft];
};


module.exports = {
  areSameSize2DArray,
  cloneViaJson,
  performPseudoVectorAddition,
};
