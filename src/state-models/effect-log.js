/**
 * @typedef {Object} State~EffectLog
 * @property {?string} unitUid
 * @property {?number} damagePoints
 * @property {?number} healingPoints
 */


/** @module */
const createNewEffectLogState = (options = {}) => {
  const {
    unitUid,
    damagePoints,
    healingPoints,
  } = Object.assign({
    unitUid: null,
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
