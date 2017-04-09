// @flow

/*::
import type { AnimationDestinationType, FactionType } from '../constants';
import type { CoordinateState, EffectState, LocationState, RectangleState } from '../types/states';
 */


const uuidV4 = require('uuid').v4;

const { ANIMATION_IDS } = require('../immutable/animations');
const { ACT_EFFECT_RANGE_TYPES, ANIMATION_DESTINATION_TYPES, PARAMETERS } = require('../constants');
const { addCoordinates, createNewCoordinateState, isCoordinateInRange } = require('./coordinate');
const { coordinateToRectangle, locationToCoordinate } = require('./geometric-apis');


const createNewEffectState = (
  affectableFractionTypes/*:FactionType[]*/,
  impactedLocation/*:LocationState*/,
  options/*:{
    aimedUnitUid?: string|null,
    relativeCoordinates?: number[][]|null,
    animationId?: string,
    animationDestinationType?: AnimationDestinationType,
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

const createEffectiveCoordinates = (
  effect/*:EffectState*/, endPointCoordinate/*:CoordinateState*/
)/*:any[]*/ => {
  const impactedCoordinate = locationToCoordinate(effect.impactedLocation);
  const startPointCoordinate = createNewCoordinateState(0, 0);

  return (effect.relativeCoordinates || [])
    .map(([ rowIndex, columnIndex ]) => {
      return addCoordinates(impactedCoordinate, createNewCoordinateState(rowIndex, columnIndex));
    })
    .filter(coordinate => isCoordinateInRange(coordinate, startPointCoordinate, endPointCoordinate))
  ;
};

const createEffectiveRectangles = (
  effect/*:EffectState*/, endPointCoordinate/*:CoordinateState*/
)/*:RectangleState[]*/ => {
  return createEffectiveCoordinates(effect, endPointCoordinate).map(coordinateToRectangle);
};


module.exports = {
  createEffectiveCoordinates,
  createEffectiveRectangles,
  createNewEffectState,
};
