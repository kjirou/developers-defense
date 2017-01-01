/**
 * @typedef {number[]} State~Location
 * @description [top, left] position on the battle-board
 */

/**
 * @typedef {Object} State~Unit
 * @property {?string} factionType - One of the FACTION_TYPES
 * @property {State~Placement} placement
 * @property {?State~Location} location
 * @property {State~Location[]} destinations
 * @property {number} destinationIndex
 *   The index of the currently active element in destinations. 0 ~ (destinations.length - 1)
 * @property {number} movingSpeed - 1.0=2px/1tick
 */

/**
 * @typedef {Object} State~Ally
 * @property {string} factionType - = FACTION_TYPES.ALLY
 * @description Based on the {@link State~Unit}
 */

/**
 * @typedef {Object} State~Enemy
 * @property {string} factionType - = FACTION_TYPES.ENEMY
 * @description Based on the {@link State~Unit}
 */


/** @module */
const uuidV4 = require('uuid/v4');

const { FACTION_TYPES, PARAMETERS } = require('../immutable/constants');
const { JOB_IDS, jobs } = require('../immutable/jobs');
const { performPseudoVectorAddition } = require('../lib/core');
const { createNewPlacementState } = require('./placement');


const createNewUnitState = () => {
  const maxHp = PARAMETERS.MIN_MAX_HP;

  return {
    uid: uuidV4(),
    factionType: null,
    placement: createNewPlacementState(),
    jobId: JOB_IDS.NONE,
    location: null,
    destinations: [],
    destinationIndex: 0,
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

/**
 * Calculate the movement results for next one tick
 * @param {State~Unit} unit
 * @return {{ location, destinationIndex }}
 */
const calculateMovementResults = (unit) => {
  if (unit.destinations.length === 0) {
    throw new Error(`This unit should not move`);
  }

  // Movement is already finished
  if (unit.destinationIndex > unit.destinations.length - 1) {
    return {
      location: unit.location,
      destinationIndex: unit.destinationIndex,
    };
  }

  const currentDestination = unit.destinations[unit.destinationIndex];

  let newLocation;
  if (unit.location) {
    // TODO: Calculate moving speed
    newLocation = performPseudoVectorAddition(unit.location, currentDestination, 2);
  // The first movement means that the unit is placed on the board
  } else {
    newLocation = currentDestination;
  }

  const newDestinationIndex = unit.destinationIndex +
    (newLocation[0] === currentDestination[0] && newLocation[1] === currentDestination[1] ? 1 : 0);

  return {
    location: newLocation,
    destinationIndex: newDestinationIndex,
  };
};


module.exports = {
  calculateMovementResults,
  canRetreatAsAlly,
  canSortieAsAlly,
  createNewUnitState,
  isAlly,
  getIconId,
};
