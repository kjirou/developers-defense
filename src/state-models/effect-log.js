/**
 * @typedef {Object} State~EffectLog
 * @description Log of the effect occured for the unit
 * @property {string} unitUid
 * @property {?number} damagePoints
 * @property {?number} healingPoints
 */


/** @module */
const createNewEffectLogState = (unitUid, options = {}) => {
  const {
    damagePoints,
    healingPoints,
  } = Object.assign({
    damagePoints: null,
    healingPoints: null,
  }, options);

  return {
    unitUid,
    damagePoints,
    healingPoints,
  };
};


module.exports = {
  createNewEffectLogState,
};
