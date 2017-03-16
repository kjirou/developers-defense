// @flow

/*::
import type { ActImmutableObject } from '../immutable/acts';
import type { UnitState } from '../types/states';
 */

const clamp = require('lodash.clamp');
const uuidV4 = require('uuid/v4');

const { FACTION_TYPES, FRIENDSHIP_TYPES, PARAMETERS } = require('../immutable/constants');
const { ACT_IDS, acts } = require('../immutable/acts');
const { JOB_IDS, jobs } = require('../immutable/jobs');
const parameters = require('../lib/parameters');
const { createNewPlacementState } = require('./placement');
const { areSameLocations, performPseudoVectorAddition } = require('./location');


const createNewUnitState = ()/*:UnitState*/ => {
  return {
    uid: uuidV4(),
    factionType: FACTION_TYPES.NONE,
    placement: createNewPlacementState(),
    location: null,
    destinations: [],
    destinationIndex: 0,
    jobId: JOB_IDS.NONE,
    hitPoints: parameters.maxHitPoints.min,
    fixedMaxHitPoints: null,
    movingSpeed: 5,
    movePoints: 0,
    actionPoints: 0,
    maxActionPoints: 20,  // TODO: Temporary setting
    actionPointsRecovery: 1,  // TODO: Temporary setting
    attackPower: 0,
    defensePower: 0,
    mattackPower: 0,
    mdefensePower: 0,
  };
};

const createNewAllyState = ()/*:UnitState*/ => {
  return Object.assign({}, createNewUnitState(), {
    factionType: FACTION_TYPES.ALLY,
  });
};

const createNewEnemyState = ()/*:UnitState*/ => {
  return Object.assign({}, createNewUnitState(), {
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

// DEPRECATED:
const isAlly = (unit/*:UnitState*/)/*:boolean*/ => {
  return unit.factionType === FACTION_TYPES.ALLY;
};

const getJob = (unit/*:UnitState*/) => {
  return jobs[unit.jobId];
};

const getAct = (unit/*:UnitState*/)/*:ActImmutableObject*/ => {
  // TODO
  if (unit.jobId === JOB_IDS.HEALER) {
    return acts.TREATMENT;
  } else if (unit.jobId === JOB_IDS.MAGE) {
    return acts.MAGICAL_BLAST;
  } else {
    return acts.MELEE_ATTACK;
  }
};

const getIconId = (unit/*:UnitState*/)/*:string*/ => {
  return getJob(unit).iconId;
};

const getMaxHitPoints = (unit/*:UnitState*/)/*:number*/ => {
  // TODO
  return unit.fixedMaxHitPoints || 10;
};

const calculateUpdateHitPoints = (unit/*:UnitState*/, nextHp/*:number*/)/*:number*/ => {
  return clamp(nextHp, 0, getMaxHitPoints(unit));
};

const calculateHealing = (unit/*:UnitState*/, points/*:number*/) => {
  const actualPoints = Math.max(0, points);

  return {
    hitPoints: calculateUpdateHitPoints(unit, unit.hitPoints + actualPoints),
    healingPoints: actualPoints,
  };
};

const calculateHealingByRate = (unit/*:UnitState*/, rate/*:number*/) => {
  return calculateHealing(unit, Math.ceil(getMaxHitPoints(unit) * rate));
};

const calculateDamage = (unit/*:UnitState*/, points/*:number*/) => {
  const actualPoints = Math.max(0, points);

  return {
    hitPoints: calculateUpdateHitPoints(unit, unit.hitPoints - actualPoints),
    damagePoints: actualPoints,
  };
};

const calculateDamageByRate = (unit/*:UnitState*/, rate/*:number*/) => {
  return calculateDamage(unit, Math.ceil(getMaxHitPoints(unit) * rate));
};

const isFullHitPoints = (unit/*:UnitState*/)/*:boolean*/ => {
  return unit.hitPoints === getMaxHitPoints(unit);
}

const isDead = (unit/*:UnitState*/)/*:boolean*/ => {
  return unit.hitPoints === 0;
}

const isAlive = (unit/*:UnitState*/)/*:boolean*/ => {
  return !isDead(unit);
}

const isActable = (unit/*:UnitState*/)/*:boolean*/ => {
  return isAlive(unit);
}

/**
 * Calculate the movement results for next one tick
 */
const calculateMovementResults = (unit/*:UnitState*/) => {
  if (unit.destinations.length === 0) {
    throw new Error(`This unit should not move`);
  }

  // Movement is already finished
  if (unit.destinationIndex > unit.destinations.length - 1) {
    return {
      movePoints: 0,
      location: unit.location,
      destinationIndex: unit.destinationIndex,
    };
  }

  const currentDestination = unit.destinations[unit.destinationIndex];

  let newMovePoints = unit.movePoints;
  let newLocation;

  if (unit.location) {
    newMovePoints += unit.movingSpeed;

    if (newMovePoints >= PARAMETERS.NECESSARY_MOVE_POINTS) {
      newMovePoints -= PARAMETERS.NECESSARY_MOVE_POINTS;
      newLocation = performPseudoVectorAddition(unit.location, currentDestination, PARAMETERS.SQUARE_SIDE_LENGTH);
    } else {
      newLocation = unit.location;
    }
  // This case is the first movement.
  // That means the unit is placed on the board.
  } else {
    newLocation = currentDestination;
  }

  const newDestinationIndex =
    unit.destinationIndex + (areSameLocations(newLocation, currentDestination) ? 1 : 0);

  return {
    movePoints: newMovePoints,
    location: newLocation,
    destinationIndex: newDestinationIndex,
  };
};

const calculateActionPointsConsumption = (unit/*:UnitState*/, act/*:any*/)/*:number*/ => {
  // TODO: Calculate from the setting of the Act
  return 0;
};

const calculateActionPointsRecovery = (unit/*:UnitState*/)/*:number*/ => {
  return clamp(unit.actionPoints + unit.actionPointsRecovery, 0, unit.maxActionPoints);
};

/**
 * @return - One of FRIENDSHIP_TYPES
 */
const determineFriendship = (unitA/*:UnitState*/, unitB/*:UnitState*/)/*:string*/ => {
  return unitA.factionType === unitB.factionType ? FRIENDSHIP_TYPES.FRIENDLY : FRIENDSHIP_TYPES.UNFRIENDLY;
};

const areActionPointsEnough = (unit/*:UnitState*/, act/*:any*/)/*:boolean*/ => {
  // TODO:
  return unit.actionPoints >= unit.maxActionPoints;
};

const canDoAct = (unit/*:UnitState*/, act/*:any*/)/*:boolean*/ => {
  return isActable(unit) && areActionPointsEnough(unit, act);
};


module.exports = {
  areActionPointsEnough,
  calculateActionPointsConsumption,
  calculateActionPointsRecovery,
  calculateMovementResults,
  calculateDamage,
  calculateDamageByRate,
  calculateHealing,
  calculateHealingByRate,
  canDoAct,
  createNewAllyState,
  createNewEnemyState,
  createNewUnitState,
  determineFriendship,
  isActable,
  isAlive,
  isAlly,
  isDead,
  isFullHitPoints,
  getAct,
  getIconId,
  getMaxHitPoints,
};
