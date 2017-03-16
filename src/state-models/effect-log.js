// @flow

/*::
import type { EffectLogState } from '../types/states';
 */

const uuidV4 = require('uuid/v4');


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
    uid: uuidV4(),
    unitUid,
    damagePoints,
    healingPoints,
  };
};


module.exports = {
  createNewEffectLogState,
};
