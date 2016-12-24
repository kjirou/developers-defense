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

const createBranchReducer = (reducements, initialState) => {
  return (state = initialState, action) => {
    // NOTICE: The "@@redux/INIT" action.type may come.
    //         Ref) https://github.com/reactjs/redux/issues/382
    const reducement = reducements[action.type] || null;
    return reducement ? reducement(state, action) : state;
  };
};


module.exports = {
  areSameSize2DArray,
  cloneViaJson,
  createBranchReducer,
};
