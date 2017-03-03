// @flow

/*::
import type { PlacementState, UnitCollectionState, UnitState } from '../types/states';
 */

const { areSamePlacements } = require('./placement');


const createNewUnitCollectionState = ()/*:UnitCollectionState*/ => {
  return [];
};


const findUnitsByPlacement = (
  unitCollection/*:UnitCollectionState*/, placement/*:PlacementState*/
)/*:UnitCollectionState*/ => {
  return unitCollection.filter(unit => areSamePlacements(unit.placement, placement));
};

const findUnitByUid = (
  unitCollection/*:UnitCollectionState*/, uid/*:string*/
)/*:UnitState|null*/ => {
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
