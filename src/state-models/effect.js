/**
 * @typedef {Object} State~Effect
 * @property {string} uid
 * @property {State~Location} impactedLocation
 * @property {string} effectRangeType - One of ACT_EFFECT_RANGE_TYPES
 * @property {string[]} affectableFractionTypes - Some of FACTION_TYPES
 * @property {?string} aimedUnitUid
 */


/** @module */
const uuidV4 = require('uuid/v4');

const { ACT_EFFECT_RANGE_TYPES, FACTION_TYPES, FRIENDSHIP_TYPES, PARAMETERS } = require('../immutable/constants');


const createNewEffectState = (impactedLocation, effectRangeType, affectableFractionTypes, options = {}) => {
  const {
    aimedUnitUid,
  } = Object.assign({
    aimedUnitUid: null
  }, options);

  if (effectRangeType === ACT_EFFECT_RANGE_TYPES.UNIT && aimedUnitUid === null) {
    throw new Error('`aimedUnitUid` is required if `effectRangeType` is "UNIT"');
  }

  return {
    uid: uuidV4(),
    impactedLocation,
    effectRangeType,
    affectableFractionTypes,
    aimedUnitUid,
    // TODO: type? effectInstants?
    damagePoints: 1,
    healingPoints: 0,
  };
};


module.exports = {
  createNewEffectState,
};
