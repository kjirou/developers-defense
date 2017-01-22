/**
 * @typedef {Object} State~Effect
 * @property {string} uid
 * @property {string[]} affectableFractionTypes - Some of FACTION_TYPES
 * @property {State~Location} impactedLocation
 * @property {?string} aimedUnitUid
 * @property {?Array<Array<number>>} relativeCoordinates - Relative coordinates indicating range of the effect
 */


/** @module */
const uuidV4 = require('uuid/v4');

const { ACT_EFFECT_RANGE_TYPES, FACTION_TYPES, FRIENDSHIP_TYPES, PARAMETERS } = require('../immutable/constants');


const createNewEffectState = (affectableFractionTypes, impactedLocation, options = {}) => {
  const {
    aimedUnitUid,
    relativeCoordinates,
    damagePoints,
    healingPoints,
  } = Object.assign({
    aimedUnitUid: null,
    relativeCoordinates: null,
    damagePoints: 0,
    healingPoints: 0,
  }, options);

  if (aimedUnitUid === null && relativeCoordinates === null) {
    throw new Error('Either `aimedUnitUid` and `relativeCoordinates` is required');
  }

  return {
    uid: uuidV4(),
    affectableFractionTypes,
    impactedLocation,
    aimedUnitUid,
    relativeCoordinates,
    damagePoints,
    healingPoints,
  };
};


module.exports = {
  createNewEffectState,
};
