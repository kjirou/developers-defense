// @flow

/*::
import type {
  FactionType,
  FriendshipType,
} from '../constants';
import type { ActImmutableObject } from '../immutable/acts';
import type {
  BoardState,
  BulletState,
  CoordinateState,
  EffectState,
  EffectLogState,
  LocationState,
  PlacementState,
  RectangleState,
  SquareState,
  UnitState,
  UnitStateChangeLogState,
} from '../types/states';
 */

const { areBoxesOverlapping } = require('box-overlap');

const config = require('../config');
const {
  ACT_AIM_RANGE_TYPES,
  ACT_EFFECT_RANGE_TYPES,
  BOARD_TYPES,
  FACTION_TYPES,
  FRIENDSHIP_TYPES,
  STYLES,
  UNIT_STATE_CHANGE_LOG_TYPES,
} = require('../constants');
const { expandReachToRelativeCoordinates } = require('../lib/core');
const bulletMethods = require('./bullet');
const coordinateMethods = require('./coordinate');
const effectMethods = require('./effect');
const geometricApis = require('./geometric-apis');
const {
  coordinateToLocation,
  coordinateToRectangle,
  locationToCoordinate,
  locationToRectangle,
  rectangleToCoordinate,
  rectangleToLocation,
} = geometricApis;  // Expand only useful methods
const locationMethods = require('./location');
const rectangleMethods = require('./rectangle');
const squareMatrixMethods = require('./square-matrix');
const unitMethods = require('./unit');
const unitStateChangeLogMethods = require('./unit-state-change-log');


const getUnitPositionAsLocationOrNull = (unit/*:UnitState*/)/*:LocationState|null*/ => {
  if (unit.location) {
    return unit.location;
  } else if (unit.placement && unit.placement.boardType === BOARD_TYPES.BATTLE_BOARD && unit.placement.coordinate) {
    return coordinateToLocation(unit.placement.coordinate);
  }
  return null;
};

/**
 * @throws {Error} The unit does not have either `location` or `placement`
 */
const getUnitPositionAsLocation = (unit/*:UnitState*/)/*:LocationState*/ => {
  const location = getUnitPositionAsLocationOrNull(unit);

  if (!location) {
    console.error('unit =', unit);
    throw new Error(`The unit does not have either \`location\` or \`placement\``);
  }

  return location;
};

const isUnitInBattle = (unit/*:UnitState*/)/*:boolean*/ => {
  return Boolean(getUnitPositionAsLocationOrNull(unit) && unitMethods.isAlive(unit));
};

/**
 * @throws {Error}
 */
const choiceClosestCoordinateUnderTargetedUnit = (
  actor/*:UnitState*/, targetedUnit/*:UnitState*/, endPointCoordinate/*:CoordinateState*/
)/*:CoordinateState*/ => {
  const actorLocation = getUnitPositionAsLocation(actor);
  const targetedUnitLocation = getUnitPositionAsLocation(targetedUnit);
  const targetedUnitRectangle = locationToRectangle(targetedUnitLocation);

  const candidates = geometricApis.findCoordinatesWhereRectangleOverlaps(
    targetedUnitRectangle, endPointCoordinate);

  // Since enemies can only move up / down / left / right,
  //   it should not be more than 2 coordinates.
  // Ref) calculateEnemyMovementResults
  if (candidates.length !== 1 && candidates.length !== 2) {
    throw new Error('Enemy position is wrong');
  }

  // Sort in order of closeness
  return candidates.sort((a, b) => {
    const aLocation = coordinateToLocation(a);
    const bLocation = coordinateToLocation(b);
    const distanceToA = locationMethods.measureDistance(actorLocation, aLocation);
    const distanceToB = locationMethods.measureDistance(actorLocation, bLocation);

    if (distanceToA < distanceToB) {
      return -1;
    } else if (distanceToA > distanceToB) {
      return 1;
    }
    return 0;
  })[0];
};

const findSquaresFromBoardsByPlacement = (
  placement/*:PlacementState*/, ...boards/*:BoardState[]*/
)/*:SquareState[]*/ => {
  const squares = [];

  boards
    .filter(board => placement.boardType === board.boardType)
    .forEach(board => {
      if (placement.coordinate) {
        const square = squareMatrixMethods.findSquareByCoordinate(board.squareMatrix, placement.coordinate);
        if (square) squares.push(square);
      }
    })
  ;

  return squares;
};

/**
 * @throws {Error} Found multiple squares
 */
const findOneSquareFromBoardsByPlacement = (
  placement/*:PlacementState*/, ...boards/*:BoardState[]*/
)/*:SquareState|null*/ => {
  const squares = findSquaresFromBoardsByPlacement(placement, ...boards);

  if (squares.length > 1) {
    throw new Error(`There are multiple squares found by the placement of ${ JSON.stringify(placement) }`);
  }

  return squares[0] || null;
};

/**
 * @throws {Error}
 */
const judgeAffectableFractionTypes = (
  actFriendshipType/*:FriendshipType*/, actorFactionType/*:FactionType*/
)/*:FactionType[]*/ => {
  if (actFriendshipType === FRIENDSHIP_TYPES.FRIENDLY) {
    return [actorFactionType];
  } else if (actFriendshipType === FRIENDSHIP_TYPES.UNFRIENDLY) {
    if (actorFactionType === FACTION_TYPES.ALLY) {
      return [FACTION_TYPES.ENEMY];
    } else if (actorFactionType === FACTION_TYPES.ENEMY) {
      return [FACTION_TYPES.ALLY];
    }
  }

  throw new Error(`Invalid actFriendshipType=${ actFriendshipType } or actorFactionType=${ actorFactionType }`);
};

const willActorAimActAtUnit = (actor/*:UnitState*/, act/*:ActImmutableObject*/, unit/*:UnitState*/)/*:boolean*/ => {
  return isUnitInBattle(unit) &&
    act.friendshipType === unitMethods.determineFriendship(actor, unit);
};

/**
 * @param actor - Only those in battle
 * @param target - Only those in battle
 * @throws {Error}
 */
const canActorAimActAtTargetedUnit = (
  actor/*:UnitState*/, act/*:ActImmutableObject*/, target/*:UnitState*/
)/*:boolean*/ => {
  if (act.aimRange.type === ACT_AIM_RANGE_TYPES.REACHABLE) {
    // TODO: 暗黙的にユニットのサイズをマス目と同じとしているが、これで問題ないのか不明。
    const actorLocation = getUnitPositionAsLocation(actor);
    const reachableRects = geometricApis.createReachableRectangles(actorLocation, act.aimRange.reach);
    const targetLocation = getUnitPositionAsLocation(target);
    const targetRect = locationToRectangle(targetLocation);
    return reachableRects.some(rect => areBoxesOverlapping(rect, targetRect));
  }

  throw new Error(`Invalid aim-range-type`);
};

const choiceAimedUnit = (
  actor/*:UnitState*/,
  act/*:ActImmutableObject*/,
  units/*:UnitState[]*/,
  boardRectangle/*:RectangleState*/
)/*:UnitState | null*/ => {
  const aimableUnits = units
    .filter(unit => willActorAimActAtUnit(actor, act, unit))
    .filter(unit => {
      const unitRectangle = locationToRectangle(getUnitPositionAsLocation(unit));
      return areBoxesOverlapping(unitRectangle, boardRectangle);
    })
    .filter(unit => canActorAimActAtTargetedUnit(actor, act, unit));

  const actorLocation = getUnitPositionAsLocation(actor);

  aimableUnits.sort((a, b) => {
    const aLocation = getUnitPositionAsLocation(a);
    const bLocation = getUnitPositionAsLocation(b);

    // 1st: Sort by closest
    const actorToA = locationMethods.measureDistance(actorLocation, aLocation);
    const actorToB = locationMethods.measureDistance(actorLocation, bLocation);
    if (actorToA < actorToB) {
      return -1;
    } else if (actorToA > actorToB) {
      return 1;
    }

    // 2nd; Sort by clock-wise
    const angleA = locationMethods.measureAngleWithTopAsZero(actorLocation, aLocation);
    const angleB = locationMethods.measureAngleWithTopAsZero(actorLocation, bLocation);
    if (angleA !== null && angleB !== null) {
      if (angleA < angleB) {
        return -1;
      } else if (angleA > angleB) {
        return 1;
      }
    }

    return 0;
  });

  return aimableUnits[0] || null;
};

/**
 * Create bullets carrying effects on each
 * @param options.effect - Pass the effect from the outside. It is mainly for testing.
 */
const fireBullets = (
  actor/*:UnitState*/,
  act/*:ActImmutableObject*/,
  aimedUnit/*:UnitState*/,
  squareMatrixEndPointCoordinate/*:CoordinateState*/,
  options/*:{ effect?: EffectState | null }*/ = {}
)/*:BulletState[]*/ => {
  const defaultedOptions = Object.assign({}, {
    effect: null,
  }, options);

  const bullets = [];

  const actorLocation = getUnitPositionAsLocation(actor);
  const aimedUnitLocation = getUnitPositionAsLocation(aimedUnit);

  const fromLocation = locationMethods.calculateCenterOfSquare(actorLocation);

  let toLocation;
  if (act.effectRange.type === ACT_EFFECT_RANGE_TYPES.UNIT) {
    toLocation = locationMethods.calculateCenterOfSquare(aimedUnitLocation);
  } else {
    toLocation = locationMethods.calculateCenterOfSquare(
      coordinateToLocation(
        choiceClosestCoordinateUnderTargetedUnit(actor, aimedUnit, squareMatrixEndPointCoordinate)
      )
    );
  }

  const direction = locationMethods.measureAngleAsEffectDirection(fromLocation, toLocation);

  let effect;
  if (options.effect) {
    effect = options.effect;
  } else {
    const effectOptions/*:Object*/ = {
      damagePoints: act.effectParameters.damagePoints,
      healingPoints: act.effectParameters.healingPoints,
      animationId: act.effectAnimation.id,
      animationDestinationType: act.effectAnimation.destinationType,
    };
    if (act.effectRange.type === ACT_EFFECT_RANGE_TYPES.UNIT) {
      effectOptions.aimedUnitUid = aimedUnit.uid;
    } else {
      effectOptions.relativeCoordinates = act.expandEffectRangeToRelativeCoordinates(direction);
    }

    effect = effectMethods.createNewEffectState(
      judgeAffectableFractionTypes(act.friendshipType, actor.factionType),
      toLocation,
      effectOptions
    );
  }

  bullets.push(bulletMethods.createNewBulletState(fromLocation, toLocation, act.bullet.speed, effect));

  return bullets;
};

const applyEffectToUnit = (
  effect/*:EffectState*/, unit/*:UnitState*/, tickId/*:number*/
)/*:{ newUnit: UnitState, unitStateChangeLogs: UnitStateChangeLogState[] }*/ => {
  let newUnit = Object.assign({}, unit);
  const unitStateChangeLogs = [];

  const log = (type, value) => {
    unitStateChangeLogs.push(
      unitStateChangeLogMethods.createNewUnitStateChangeLogState(unit.uid, tickId, type, value)
    );
  };

  // Healing
  if (effect.healingPoints > 0) {
    const result = unitMethods.calculateHealing(unit, effect.healingPoints);

    newUnit = Object.assign({}, newUnit, { hitPoints: result.hitPoints });
    log(UNIT_STATE_CHANGE_LOG_TYPES.HEALING, result.healingPoints);
  }

  // Damaging
  if (effect.damagePoints > 0) {
    const result = unitMethods.calculateDamage(unit, effect.damagePoints);

    newUnit = Object.assign({}, newUnit, { hitPoints: result.hitPoints });
    log(UNIT_STATE_CHANGE_LOG_TYPES.DAMAGE, result.damagePoints);
  }

  return {
    newUnit,
    unitStateChangeLogs,
  };
};

/**
 * Apply effect to units within the effective range
 */
const effectOccurs = (
  effect/*:EffectState*/, units/*:UnitState[]*/, tickId/*:number*/, endPointCoordinate/*:CoordinateState*/
)/*:{ units: UnitState[], unitStateChangeLogs: UnitStateChangeLogState[] }*/ => {
  const unitStateChangeLogs = [];

  const effectiveRectangles = effectMethods.createEffectiveRectangles(effect, endPointCoordinate);

  const newUnits = units.map(unit => {
    if (!isUnitInBattle(unit)) return unit;

    const unitLocation = getUnitPositionAsLocation(unit);
    const unitRectangle = locationToRectangle(unitLocation);

    if (effect.affectableFractionTypes.indexOf(unit.factionType) > -1) {
      if (
        (
          effect.aimedUnitUid &&
          unit.uid === effect.aimedUnitUid &&
          areBoxesOverlapping(
            // TODO: bullet size
            locationToRectangle(effect.impactedLocation, { width: 4, height: 4, asCenterPoint: true }),
            locationToRectangle(unitLocation)
          )
        )
        ||
        (
          effectiveRectangles.some(rect => areBoxesOverlapping(rect, unitRectangle))
        )
      ) {
        const resultApplied = applyEffectToUnit(effect, unit, tickId);

        resultApplied.unitStateChangeLogs.forEach(v => unitStateChangeLogs.push(v));

        return resultApplied.newUnit;
      }
    }

    return unit;
  });

  return {
    units: newUnits,
    unitStateChangeLogs,
  };
};

/**
 * Compute the state transition during the "tick"
 * The "tick" is a coined word, which means so-called "one game loop".
 * @param state - A plain object generated from `store.getState()`
 */
const computeTick = ({ allies, enemies, bullets, battleBoard, gameStatus }/*:Object*/)/*:Object*/ => {
  const battleBoardEndPointCoordinate = squareMatrixMethods.getEndPointCoordinate(battleBoard.squareMatrix);
  const battleBoardRectangle = squareMatrixMethods.toRectangle(battleBoard.squareMatrix);

  let newBullets = bullets.slice();
  let newAllies = allies.slice();
  let newEnemies = enemies.slice();
  let newUnitStateChangeLogs = [];

  // Send dead enemies to the graveyard
  // TODO: Move to another part of the state instead of delete.
  newEnemies = newEnemies.filter(unitMethods.isAlive);

  // Send dead allies to the sortie board
  // TODO

  // Bullets movement and effect
  newBullets = newBullets
    // Apply effect & Clean effect occured bullets
    .filter(bullet => {
      if (!bulletMethods.isArrivedToDestination(bullet)) {
        return true;
      };

      const effectResult = effectOccurs(
        bullet.effect, newAllies.concat(newEnemies), gameStatus.tickId, battleBoardEndPointCoordinate);
      newAllies = effectResult.units.filter(unit => unit.factionType === FACTION_TYPES.ALLY);
      newEnemies = effectResult.units.filter(unit => unit.factionType === FACTION_TYPES.ENEMY);
      newUnitStateChangeLogs = newUnitStateChangeLogs.concat(effectResult.unitStateChangeLogs);

      return false;
    })
    // Bullets move
    //   The reason for the movement after the effect calculation is to guarantee landing on the display.
    .map(bullet => {
      return Object.assign({}, bullet, {
        location: bulletMethods.calculateNextLocation(bullet),
      });
    })
  ;

  // Separate dead units in this tick
  let alivedEnemies = newEnemies.filter(unitMethods.isAlive);
  let deadEnemies = newEnemies.filter(unitMethods.isDead);

  // Enemy's movement
  alivedEnemies = alivedEnemies.map(enemy => {
    const { movePoints, location, destinationIndex } = unitMethods.calculateEnemyMovementResults(enemy);

    return Object.assign({}, enemy, {
      movePoints,
      location,
      destinationIndex,
    });
  });

  // Ally's MP recovery
  newAllies = newAllies.map(ally => {
    return Object.assign({}, ally, {
      movePoints: unitMethods.calculateMovePointsRecovery(ally),
    });
  });

  // Ally's act
  newAllies = newAllies.map(ally => {
    const newAlly = Object.assign({}, ally);

    if (!isUnitInBattle(newAlly)) {
      // TODO: 出撃ポイントの回復
      return newAlly;
    }

    const act = unitMethods.getAct(newAlly);

    let didAct = false;

    if (unitMethods.canDoAct(newAlly, act)) {
      const aimedUnit = choiceAimedUnit(newAlly, act, newAllies.concat(alivedEnemies), battleBoardRectangle);

      if (aimedUnit) {
        if (config.isEnabledTickLog) {
          console.debug(`${ newAlly.factionType }:${ newAlly.jobId } aims ${ act.id } at ${ aimedUnit.factionType }:${ aimedUnit.jobId }`);
        }

        // Create bullets carrying effect on each
        newBullets = newBullets.concat(fireBullets(newAlly, act, aimedUnit, battleBoardEndPointCoordinate));

        // Comsume APs
        newAlly.actionPoints = unitMethods.calculateActionPointsConsumption(newAlly, act);

        didAct = true;
      }
    }

    if (!didAct) {
      // Recover APs
      newAlly.actionPoints = unitMethods.calculateActionPointsRecovery(newAlly);
    }

    return newAlly;
  });

  // Enemy's act
  // TODO

  return {
    allies: newAllies,
    enemies: alivedEnemies.concat(deadEnemies),
    bullets: newBullets,
    unitStateChangeLogs: newUnitStateChangeLogs,
  };
};


module.exports = {
  _applyEffectToUnit: applyEffectToUnit,
  _choiceAimedUnit: choiceAimedUnit,
  _choiceClosestCoordinateUnderTargetedUnit: choiceClosestCoordinateUnderTargetedUnit,
  _effectOccurs: effectOccurs,
  canActorAimActAtTargetedUnit,
  computeTick,
  findOneSquareFromBoardsByPlacement,
  fireBullets,
  judgeAffectableFractionTypes,
  willActorAimActAtUnit,
};
