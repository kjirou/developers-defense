/**
 * @typedef {Object} State~Unit
 * @property {?string} factionType - One of the FACTION_TYPES
 * @property {State~Placement} placement
 * @property {?State~Location} location
 * @property {State~Location[]} destinations - x and y should be defined by integer
 * @property {number} destinationIndex
 *   The index of the currently active element in destinations. 0 ~ (destinations.length - 1)
 * @property {number} movingSpeed - 1.0=2px/1tick
 * @property {number} actionPoints - A integer >= 0
 * @property {number} maxActionPoints - A integer >= 0
 * @property {number} actionPointsRecovery - A integer >= 0
 */

/**
 * @typedef {Object} State~Ally
 * @property {string} factionType - = FACTION_TYPES.ALLY
 * @description Based on {@link State~Unit}
 */

/**
 * @typedef {Object} State~Enemy
 * @property {string} factionType - = FACTION_TYPES.ENEMY
 * @description Based on {@link State~Unit}
 */


/** @module */
const clamp = require('lodash.clamp');
const uuidV4 = require('uuid/v4');

const { FACTION_TYPES, FRIENDSHIP_TYPES, PARAMETERS } = require('../immutable/constants');
const { ACT_IDS, acts } = require('../immutable/acts');
const { JOB_IDS, jobs } = require('../immutable/jobs');
const parameters = require('../lib/parameters');
const { createNewPlacementState } = require('./placement');
const { areSameLocations, performPseudoVectorAddition } = require('./location');


const createNewUnitState = () => {
  return {
    uid: uuidV4(),
    factionType: null,
    placement: createNewPlacementState(),
    jobId: JOB_IDS.NONE,
    location: null,
    destinations: [],
    destinationIndex: 0,
    hitPoints: parameters.maxHitPoints.min,
    fixedMaxHitPoints: null,
    movingSpeed: 0,
    actionPoints: 0,
    maxActionPoints: 20,  // TODO: Temporary setting
    actionPointsRecovery: 1,  // TODO: Temporary setting
    attackPower: 0,
    defensePower: 0,
    mattackPower: 0,
    mdefensePower: 0,
  };
};

const createNewAllyState = () => {
  return Object.assign(createNewUnitState(), {
    factionType: FACTION_TYPES.ALLY,
  });
};

const createNewEnemyState = () => {
  return Object.assign(createNewUnitState(), {
    factionType: FACTION_TYPES.ENEMY,
  });
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

const getAct = (unit) => {
  // TODO
  if (unit.jobId === JOB_IDS.HEALER) {
    return acts.TREATMENT;
  } else if (unit.jobId === JOB_IDS.MAGE) {
    return acts.MAGICAL_BLAST;
  } else {
    return acts.MELEE_ATTACK;
  }
};

const getIconId = (unit) => {
  return getJob(unit).iconId;
};

const getMaxHitPoints = (unit) => {
  // TODO
  return unit.fixedMaxHitPoints || 10;
};

const calculateUpdateHitPoints = (unit, nextHp) => {
  return clamp(nextHp, 0, getMaxHitPoints(unit));
};

const calculateHealing = (unit, points) => {
  const actualPoints = Math.max(0, points);

  return {
    hitPoints: calculateUpdateHitPoints(unit, unit.hitPoints + actualPoints),
    healingPoints: actualPoints,
  };
};

const calculateHealingByRate = (unit, rate) => {
  return calculateHealing(unit, Math.ceil(getMaxHitPoints(unit) * rate));
};

const calculateDamage = (unit, points) => {
  const actualPoints = Math.max(0, points);

  return {
    hitPoints: calculateUpdateHitPoints(unit, unit.hitPoints - actualPoints),
    damagePoints: actualPoints,
  };
};

const calculateDamageByRate = (unit, rate) => {
  return calculateDamage(unit, Math.ceil(getMaxHitPoints(unit) * rate));
};

const isFullHitPoints = (unit) => {
  return unit.hitPoints === getMaxHitPoints(unit);
}

const isDead = (unit) => {
  return unit.hitPoints === 0;
}

const isAlive = (unit) => {
  return !isDead(unit);
}

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

  const newDestinationIndex =
    unit.destinationIndex + (areSameLocations(newLocation, currentDestination) ? 1 : 0);

  return {
    location: newLocation,
    destinationIndex: newDestinationIndex,
  };
};

/**
 * @param {State~Unit} unit
 * @param {Function} Act - One of sub classes of {@link Immutable~Act}
 * @return {number}
 */
const calculateActionPointsConsumption = (unit, Act) => {
  // TODO: Calculate from the setting of the Act
  return 0;
};

/**
 * @param {State~Unit} unit
 * @return {number}
 */
const calculateActionPointsRecovery = (unit) => {
  return clamp(unit.actionPoints + unit.actionPointsRecovery, 0, unit.maxActionPoints);
};

/**
 * @return {string} One of FRIENDSHIP_TYPES
 */
const determineFriendship = (unitA, unitB) => {
  return unitA.factionType === unitB.factionType ? FRIENDSHIP_TYPES.FRIENDLY : FRIENDSHIP_TYPES.UNFRIENDLY;
};

/**
 * @param {State~Unit} unit
 * @return {boolean}
 */
const canDoAct = (unit) => {
  // TODO:
  return unit.actionPoints >= unit.maxActionPoints;
};


module.exports = {
  calculateActionPointsConsumption,
  calculateActionPointsRecovery,
  calculateMovementResults,
  calculateDamage,
  calculateDamageByRate,
  calculateHealing,
  calculateHealingByRate,
  canDoAct,
  canRetreatAsAlly,
  canSortieAsAlly,
  createNewAllyState,
  createNewEnemyState,
  createNewUnitState,
  determineFriendship,
  isAlive,
  isAlly,
  isDead,
  isFullHitPoints,
  getAct,
  getIconId,
  getMaxHitPoints,
};
