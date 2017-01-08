/**
 * @typedef {Object} State~Bullet
 * @property {State~Location} location
 * @property {State~Location} fromLocation
 * @property {State~Location} toLocation
 * @property {number} speed
 * @property {State~Effect} effect
 */


/** @module */


const createNewBulletState = (fromLocation, toLocation, speed, effect) => {
  return {
    location: fromLocation,
    fromLocation,
    toLocation,
    speed,
    effect,
  };
};


module.exports = {
  createNewBulletState,
};
