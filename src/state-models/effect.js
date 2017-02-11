/**
 * @typedef {Object} State~Effect
 * @property {string} uid
 * @property {string[]} affectableFractionTypes - Some of FACTION_TYPES
 * @property {State~Location} impactedLocation
 * @property {?string} aimedUnitUid
 * @property {?Array<Array<number>>} relativeCoordinates - Relative coordinates indicating range of the effect
 * @property {string} animationId - One of ANIMATION_IDS
 * @property {number} damagePoints
 * @property {number} healingPoints
 */


/** @module */
const uuidV4 = require('uuid/v4');

const { ANIMATION_IDS } = require('../immutable/animations');
const { ACT_EFFECT_RANGE_TYPES, ANIMATION_DESTINATION_TYPES, PARAMETERS } = require('../immutable/constants');
const { tryToMoveCoordinate } = require('./coordinate');
const { coordinateToRectangle, locationToCoordinate } = require('./geometric-apis');


const createNewEffectState = (affectableFractionTypes, impactedLocation, options = {}) => {
  const {
    aimedUnitUid,
    relativeCoordinates,
    animationId,
    animationDestinationType,
    damagePoints,
    healingPoints,
  } = Object.assign({
    aimedUnitUid: null,
    relativeCoordinates: null,
    animationId: ANIMATION_IDS.NONE,
    animationDestinationType: ANIMATION_DESTINATION_TYPES.NONE,
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
    animationId,
    animationDestinationType,
    damagePoints,
    healingPoints,
  };
};

/**
 * @param {State~Effect} effect
 * @return {State~Coordinate[]}
 */
const createEffectiveCoordinates = (effect) => {
  const impactedCoordinate = locationToCoordinate(effect.impactedLocation);

  return (effect.relativeCoordinates || [])
    .map(([ m, n ]) => tryToMoveCoordinate(impactedCoordinate, m, n))
    .filter(coordinate => coordinate !== null)
  ;
};

/**
 * @param {State~Effect} effect
 * @return {State~Rectangle[]}
 */
const createEffectiveRectangles = (effect) => {
  return createEffectiveCoordinates(effect).map(coordinateToRectangle);
};


module.exports = {
  createEffectiveCoordinates,
  createEffectiveRectangles,
  createNewEffectState,
};
