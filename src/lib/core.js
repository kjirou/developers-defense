/** @module */

const cloneViaJson = (value) => {
  return JSON.parse(JSON.stringify(value));
};

/**
 * @param {...Array<Array<number>>} matrices
 * @return {boolean}
 */
const areSameSizeMatrices = (...matrices) => {
  const [first, ...rest] = matrices;

  for (let restIndex = 0; restIndex < rest.length; restIndex += 1) {
    const current = rest[restIndex];

    if (first.length !== current.length) return false;

    for (let rowIndex = 0; rowIndex < first.length; rowIndex += 1) {
      if (first[rowIndex].length !== current[rowIndex].length) return false;
    }
  }

  return true;
};

/**
 * @param {...Array<Array<number>>} matrices
 * @return {Array<Array<number>>}
 */
const matrixAdd = (...matrices) => {
  if (!areSameSizeMatrices(matrices)) {
    throw new Error('Matrices are not same size');
  }

  const [first, ...rest] = matrices;
  const result = first.map(row => row.slice());

  for (let restIndex = 0; restIndex < rest.length; restIndex += 1) {
    for (let rowIndex = 0; rowIndex < first.length; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < first[rowIndex].length; columnIndex += 1) {
        result[rowIndex][columnIndex] += rest[restIndex][rowIndex][columnIndex];
      }
    }
  }

  return result;
};


module.exports = {
  areSameSizeMatrices,
  cloneViaJson,
  matrixAdd,
};
