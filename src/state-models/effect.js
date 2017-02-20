// @flow

/*::
import type { CoordinateState, EffectState, LocationState, RectangleState } from '../types/states';
 */


const uuidV4 = require('uuid/v4');

const { ANIMATION_IDS } = require('../immutable/animations');
const { ACT_EFFECT_RANGE_TYPES, ANIMATION_DESTINATION_TYPES, PARAMETERS } = require('../immutable/constants');
const { tryToMoveCoordinate } = require('./coordinate');
const { coordinateToRectangle, locationToCoordinate } = require('./geometric-apis');


const createNewEffectState = (
  affectableFractionTypes/*:string[]*/,
  impactedLocation/*:LocationState*/,
  options/*:{
    aimedUnitUid?: string|null,
    relativeCoordinates?: number[][],
    animationId?: string,
    animationDestinationType?: string,
    damagePoints?: number,
    healingPoints?: number,
  }*/ = {}
)/*:EffectState*/ => {
  const {
    aimedUnitUid,
    relativeCoordinates,
    animationId,
    animationDestinationType,
    damagePoints,
    healingPoints,
  } = Object.assign({}, {
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

const createEffectiveCoordinates = (effect/*:EffectState*/)/*:any[]*/ => {
  const impactedCoordinate = locationToCoordinate(effect.impactedLocation);

  return (effect.relativeCoordinates || [])
    .map(([ m, n ]) => tryToMoveCoordinate(impactedCoordinate, m, n))
    .filter(coordinate => coordinate !== null)
  ;
};

const createEffectiveRectangles = (effect/*:EffectState*/)/*:RectangleState[]*/ => {
  return createEffectiveCoordinates(effect).map(coordinateToRectangle);
};


module.exports = {
  createEffectiveCoordinates,
  createEffectiveRectangles,
  createNewEffectState,
};
