/**
 * @typedef {Object} State~Bullet
 * @property {State~Location} location
 * @property {State~Location} fromLocation
 * @property {State~Location} toLocation
 * @property {number} speed
 * @property {State~Effect} effect
 */


/** @module */
const Victor = require('victor');

const { areSameLocations, createNewLocationState } = require('./location');


const createNewBulletState = (fromLocation, toLocation, speed, effect) => {
  return {
    location: fromLocation,
    fromLocation,
    toLocation,
    speed,
    effect,
  };
};

/**
 * Calculate new location for the next tick
 * @param {State~Bullet} bullet
 * @return {State~Location}
 */
const calculateNextLocation = (bullet) => {
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

const isArrivedToDestination = (bullet) => {
  return areSameLocations(bullet.location, bullet.toLocation);
};


module.exports = {
  createNewBulletState,
  calculateNextLocation,
  isArrivedToDestination,
};
