/** @module */

const cloneViaJson = (value) => {
  return JSON.parse(JSON.stringify(value));
};

/**
 * @param {...Array[]} matrices
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


module.exports = {
  areSameSizeMatrices,
  cloneViaJson,
};
