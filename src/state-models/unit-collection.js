const { areSamePlace } = require('./placement');


/**
 * @typedef {State~Unit[]} State~UnitCollection
 */

const createNewUnitCollectionState = () => {
  return [];
};


const filterByPlacement = (unitCollection, placement) => {
  return unitCollection.filter(unit => areSamePlace(unit.placement, placement));
};


module.exports = {
  createNewUnitCollectionState,
  filterByPlacement,
};
