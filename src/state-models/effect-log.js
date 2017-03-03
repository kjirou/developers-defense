// @flow

/*::
import type { EffectLogState } from '../types/states';
 */


const createNewEffectLogState = (
  unitUid/*:string*/,
  options/*:{
    damagePoints?: number|null,
    healingPoints?: number|null,
  }*/ = {}
)/*:EffectLogState*/ => {
  const {
    damagePoints,
    healingPoints,
  } = Object.assign({}, {
    damagePoints: null,
    healingPoints: null,
  }, options);

  return {
    unitUid,
    damagePoints,
    healingPoints,
  };
};


module.exports = {
  createNewEffectLogState,
};
