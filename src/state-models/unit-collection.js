/**
 * @typedef {State~Unit[]} State~UnitCollection
 */


/** @module */
const { areSamePlacements } = require('./placement');


const createNewUnitCollectionState = () => {
  return [];
};


const findUnitsByPlacement = (unitCollection, placement) => {
  return unitCollection.filter(unit => areSamePlacements(unit.placement, placement));
};

/**
 * @param {string} uid
 * @return {?State~Unit}
 */
const findUnitByUid = (unitCollection, uid) => {
  for (let index = 0; index < unitCollection.length; index += 1) {
    const unit = unitCollection[index];
    if (unit.uid === uid) return unit;
  }
  return null;
};


module.exports = {
  createNewUnitCollectionState,
  findUnitByUid,
  findUnitsByPlacement,
};
