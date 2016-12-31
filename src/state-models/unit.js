/**
 * @typedef {Object} State~Unit
 * @property {?string} factionType - One of the FACTION_TYPES
 * @property {State~Placement} placement
 * @property {?number[]} location - [top, left] position on the battle-board
 * @property {number[]} destinationPlacements
 * @property {?number} nextDestinationIndex
 * @property {number} movingSpeed - 1.0=48px/1sec, 1.5=72px/1sec
 */

/**
 * @typedef {Object} State~Ally
 * @property {string} factionType - The FACTION_TYPES.ALLY is assigned
 * @description Based on the {@link State~Unit}
 */

/**
 * @typedef {Object} State~Enemy
 * @property {string} factionType - The FACTION_TYPES.ENEMY is assigned
 * @description Based on the {@link State~Unit}
 */


/** @module */
const uuidV4 = require('uuid/v4');

const { FACTION_TYPES, PARAMETERS } = require('../immutable/constants');
const { JOB_IDS, jobs } = require('../immutable/jobs');
const { createNewPlacementState } = require('./placement');


const createNewUnitState = () => {
  const maxHp = PARAMETERS.MIN_MAX_HP;

  return {
    uid: uuidV4(),
    factionType: null,
    placement: createNewPlacementState(),
    jobId: JOB_IDS.NONE,
    location: [],
    destinations: [],
    nextDestinationIndex: null,
    maxHp,
    hp: maxHp,
    attackPower: 0,
    defensePower: 0,
    mattackPower: 0,
    mdefensePower: 0,
    movingSpeed: 0,
  };
};


//
// CAUTION: It should not access the `placement` property in this module!
//          The `placement` is a relation to boards.
//          Now units refers to boards, but it may be reversed.
//          Or it may be a different schema just by placing information.
//          Place methods into the `complex-apis` if necessary.
//

const isAlly = (unit) => unit.factionType === FACTION_TYPES.ALLY;

const getJob = (unit) => {
  return jobs[unit.jobId];
};

const getIconId = (unit) => {
  return getJob(unit).iconId;
};

const canSortieAsAlly = (ally) => {
  if (!isAlly(ally)) {
    throw new Error(`It is not a ally`);
  }
  return true;
};

const canRetreatAsAlly = (ally) => {
  if (!isAlly(ally)) {
    throw new Error(`It is not a ally`);
  }
  return true;
};


module.exports = {
  canRetreatAsAlly,
  canSortieAsAlly,
  createNewUnitState,
  isAlly,
  getIconId,
};
