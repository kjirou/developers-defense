// @flow

/*::
import type { ActImmutableObject } from '../immutable/acts';
import type { UnitState } from '../types/states';
 */

const clamp = require('lodash.clamp');
const uuidV4 = require('uuid').v4;

const { FACTION_TYPES, FRIENDSHIP_TYPES, PARAMETERS } = require('../constants');
const { ACT_IDS, acts } = require('../immutable/acts');
const { JOB_IDS, jobs } = require('../immutable/jobs');
const parameters = require('../lib/parameters');
const { areSameLocations, performPseudoVectorAddition } = require('./location');


const createNewUnitState = ()/*:UnitState*/ => {
  return {
    uid: uuidV4(),
    factionType: FACTION_TYPES.NONE,
    placement: null,
    location: null,
    destinations: [],
    destinationIndex: 0,
    jobId: JOB_IDS.NONE,
    hitPoints: parameters.maxHitPoints.min,
    fixedMaxHitPoints: null,
    movePoints: 0,
    maxMovePoints: PARAMETERS.NECESSARY_MOVE_POINTS * 5,
    movePointsRecovery: 1,
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

const getHitPointsRate = (unit/*:UnitState*/)/*:number*/ => {
  return clamp(unit.hitPoints / getMaxHitPoints(unit), 0, 1.0);
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
};

const isDead = (unit/*:UnitState*/)/*:boolean*/ => {
  return unit.hitPoints === 0;
};

const isAlive = (unit/*:UnitState*/)/*:boolean*/ => {
  return !isDead(unit);
};

const isActable = (unit/*:UnitState*/)/*:boolean*/ => {
  return isAlive(unit);
};

const calculateMovableDistance = (unit/*:UnitState*/)/*:number*/ => {
  return Math.floor(unit.movePoints / PARAMETERS.NECESSARY_MOVE_POINTS);
};

const calculateMovePointsRecovery = (unit/*:UnitState*/)/*:number*/ => {
  return clamp(unit.movePoints + unit.movePointsRecovery, 0, unit.maxMovePoints);
};

const calculateMovePointsConsumptionDirectly = (movePoints/*:number*/)/*:number*/ => {
  return Math.max(movePoints - PARAMETERS.NECESSARY_MOVE_POINTS, 0);
};

/**
 * Calculate the movement results for next one tick
 */
const calculateEnemyMovementResults = (unit/*:UnitState*/) => {
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

  const currentUnitLocation = unit.location;
  const currentDestination = unit.destinations[unit.destinationIndex];

  let newMovePoints = unit.movePoints;
  let newLocation;

  if (currentUnitLocation) {
    newMovePoints += unit.movePointsRecovery * PARAMETERS.ENEMY_MOVE_SPEED_RATE;

    if (newMovePoints >= PARAMETERS.NECESSARY_MOVE_POINTS) {
      newMovePoints = 0;
      newLocation = performPseudoVectorAddition(currentUnitLocation, currentDestination, PARAMETERS.SQUARE_SIDE_LENGTH);
    } else {
      newLocation = currentUnitLocation;
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
  calculateDamage,
  calculateDamageByRate,
  calculateEnemyMovementResults,
  calculateHealing,
  calculateHealingByRate,
  calculateMovableDistance,
  calculateMovePointsRecovery,
  canDoAct,
  createNewAllyState,
  createNewEnemyState,
  createNewUnitState,
  determineFriendship,
  isActable,
  isAlive,
  isDead,
  isFullHitPoints,
  getAct,
  getHitPointsRate,
  getIconId,
  getMaxHitPoints,
};
