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


module.exports = {
  areSameSize2DArray,
};
