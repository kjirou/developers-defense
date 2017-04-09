// @flow

/*::
import type { UnitStateChangeType } from '../constants';
import type { UnitStateChangeLogState } from '../types/states';
 */

const uuidV4 = require('uuid').v4;


const createNewUnitStateChangeLogState = (
  unitUid/*:string*/,
  tickId/*:number*/,
  type/*:UnitStateChangeType*/,
  value/*:number | string | null*/
)/*:UnitStateChangeLogState*/ => {
  return {
    uid: uuidV4(),
    unitUid,
    tickId,
    type,
    value,
  };
};


module.exports = {
  createNewUnitStateChangeLogState,
};
