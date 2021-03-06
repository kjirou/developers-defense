// @flow

/*::
import type { PlacementState, UnitCollectionState, UnitState } from '../types/states';
 */

const { areSamePlacements } = require('./placement');


const createNewUnitCollectionState = ()/*:UnitCollectionState*/ => {
  return [];
};


const filterByPlacement = (
  unitCollection/*:UnitCollectionState*/, placement/*:PlacementState*/
)/*:UnitCollectionState*/ => {
  return unitCollection.filter(unit => unit.placement && areSamePlacements(unit.placement, placement));
};

const findUnitByPlacement = (
  unitCollection/*:UnitCollectionState*/, placement/*:PlacementState*/
)/*:UnitState | null*/ => {
  for (let index = 0; index < unitCollection.length; index += 1) {
    const unit = unitCollection[index];
    if (unit.placement && areSamePlacements(unit.placement, placement)) {
      return unit;
    }
  }
  return null;
};

const findUnitByUid = (
  unitCollection/*:UnitCollectionState*/, uid/*:string*/
)/*:UnitState | null*/ => {
  for (let index = 0; index < unitCollection.length; index += 1) {
    const unit = unitCollection[index];
    if (unit.uid === uid) return unit;
  }
  return null;
};


module.exports = {
  createNewUnitCollectionState,
  filterByPlacement,
  findUnitByUid,
  findUnitByPlacement,
};
