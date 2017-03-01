// @flow

/*::
import type { ActImmutableObject } from '../immutable/acts';
import type { BulletState, EffectState, LocationState } from '../types/states';
 */

const Victor = require('victor');
const uuidV4 = require('uuid/v4');

const { areSameLocations, createNewLocationState } = require('./location');


const createNewBulletState = (
  fromLocation/*:LocationState*/, toLocation/*:LocationState*/, speed/*:number*/, effect/*:EffectState*/
)/*:BulletState*/ => {
  return {
    uid: uuidV4(),
    location: fromLocation,
    fromLocation,
    toLocation,
    speed,
    effect,
  };
};

/**
 * Calculate new location for the next tick
 */
const calculateNextLocation = (bullet/*:BulletState*/)/*:LocationState*/ => {
  const vectorStart = Victor.fromObject(bullet.location);
  const vectorEnd = Victor.fromObject(bullet.toLocation);
  const distanceToEnd = vectorStart.distance(vectorEnd);

  // This `0.01` modification is to prevent one tick delay due to fractional calculation.
  if (distanceToEnd - 0.01 < bullet.speed) {
    return bullet.toLocation;
  } else {
    const vectorToNextLocation =
      vectorEnd.subtract(vectorStart).multiplyScalar(bullet.speed / distanceToEnd);

    return createNewLocationState(
      vectorStart.y + vectorToNextLocation.y,
      vectorStart.x + vectorToNextLocation.x
    );
  }
};

const isArrivedToDestination = (bullet/*:BulletState*/)/*:boolean*/ => {
  return areSameLocations(bullet.location, bullet.toLocation);
};


module.exports = {
  createNewBulletState,
  calculateNextLocation,
  isArrivedToDestination,
};
