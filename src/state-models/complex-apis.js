/** @module */
const angles = require('angles');
const boxCollide = require('box-collide');

const { ACT_AIM_RANGE_TYPES, BOARD_TYPES, STYLES } = require('../immutable/constants');
const { expandReachToRelativeCoordinates, matrixAdd } = require('../lib/core');
const locationMethods = require('./location');
const squareMatrixMethods = require('./square-matrix');
const unitMethods = require('./unit');


/**
 * @param {State~Coordinate}
 * @return {State~Location} A location of square
 */
const coordinateToSquareLocation = (coordinate) => {
  return [coordinate[0] * STYLES.SQUARE_HEIGHT, coordinate[1] * STYLES.SQUARE_WIDTH];
};

/**
 * @param {State~Location} squareLocation
 * @return {{x, y, width, height}} This is mainly used to `substack/box-collide`
 */
const squareLocationToRect = (squareLocation) => {
  return {
    x: squareLocation[1],
    y: squareLocation[0],
    width: STYLES.SQUARE_WIDTH,
    height: STYLES.SQUARE_HEIGHT,
  };
};

/**
 * @param {State~Coordinate} coordinate
 */
const coordinateToRect = (coordinate) => {
  return squareLocationToRect(coordinateToSquareLocation(coordinate));
};

/**
 * @param {State~Unit} unit
 * @return {State~Location}
 */
const getUnitPositionAsLocation = (unit) => {
  if (unit.location) {
    return unit.location;
  } else if (unit.placement) {
    return coordinateToSquareLocation(unit.placement.coordinate);
  }
  throw new Error(`The unit does not have either \`location\` or \`placement\``);
};

/**
 * @param {State~Location} centerSquareLocation
 * @param {number} reach - A integer >= 0
 * @return {Array<{x, y, width, height}>}
 * @todo Remove overflowed coordinates from result?
 */
const createReachableRects = (centerSquareLocation, reach) => {
  return expandReachToRelativeCoordinates(0, reach)
    .map(relativeCoordinate => matrixAdd([centerSquareLocation], [coordinateToSquareLocation(relativeCoordinate)]))
    .map(([location]) => squareLocationToRect(location));
};

/**
 * @return {State~Square[]}
 */
const findSquaresFromBoardsByPlacement = (placement, ...boards) => {
  const squares = [];

  boards
    .filter(board => placement.boardType === board.boardType)
    .forEach(board => {
      const square = squareMatrixMethods.findSquareByCoordinate(board.squareMatrix, placement.coordinate);
      if (square) squares.push(square);
    })
  ;

  return squares;
};

/**
 * @param {State~Placement} placement
 * @param {...State~Board} boards
 * @throws {Error} Found multiple squares
 * @return {?State~Square}
 */
const findOneSquareFromBoardsByPlacement = (placement, ...boards) => {
  const squares = findSquaresFromBoardsByPlacement(placement, ...boards);

  if (squares.length > 1) {
    throw new Error(`There are multiple squares found by the placement of ${ JSON.stringify(placement) }`);
  }

  return squares[0] || null;
};

/**
 * @param {State~Unit} unit
 * @return {boolean}
 */
const isUnitInBattle = (unit) => {
  return unit.placement.boardType === BOARD_TYPES.BATTLE_BOARD && unit.hp > 0;
};

/**
 * @param {State~Unit} actor - Only those in battle
 * @param {Act} act
 * @param {State~Unit} unit - Only those in battle
 * @return {boolean}
 */
const willActorAimActAtUnit = (actor, act, unit) => {
  return act.friendshipType === unitMethods.determineFriendship(actor, unit);
};

/**
 * @param {State~Unit} actor - Only those in battle
 * @param {Act} act
 * @param {State~Unit} target - Only those in battle
 * @return {boolean}
 */
const canActorAimActAtTargetedUnit = (actor, act, target) => {
  if (act.aimRange.type === ACT_AIM_RANGE_TYPES.REACHABLE) {
    // TODO: 暗黙的にユニットのサイズをマス目と同じとしているが、これで問題ないのか不明。
    const actorLocation = getUnitPositionAsLocation(actor);
    const reachableRects = createReachableRects(actorLocation, act.aimRange.reach);
    const targetLocation = getUnitPositionAsLocation(target);
    const targetRect = squareLocationToRect(targetLocation);
    return reachableRects.some(rect => boxCollide(rect, targetRect));
  }

  throw new Error(`Invalid aim-range-type`);
};

/**
 * @param {State~Unit} actor
 * @param {Act} act
 * @param {State~Unit[]} units
 * @return {State~Unit[]}
 */
const choiceAimedUnit = (actor, act, units) => {
  const aimableUnits = units
    .filter(unit => willActorAimActAtUnit(actor, act, unit))
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
    const angleA = angles.fromSlope([-actorLocation[0], actorLocation[1]], [-aLocation[0], aLocation[1]]);
    const angleB = angles.fromSlope([-actorLocation[0], actorLocation[1]], [-bLocation[0], bLocation[1]]);
    if (angleA < angleB) {
      return -1;
    } else if (angleA > angleB) {
      return 1;
    }

    return 0;
  });

  return aimableUnits[0] || null;
};

/**
 * Compute the state transition during the "tick"
 * <section>
 *   The "tick" is a coined word, which means so-called "one game loop".
 * </section>
 * @param {Object} state - A plain object generated from `store.getState()`
 * @return {Object}
 */
const computeTick = ({ allies, enemies, gameStatus }) => {
  let newAllies = allies.slice();
  let newEnemies = enemies.slice();

  // TODO: 死亡者を盤上から除去するのは、ループの最初と最後どこで行う？または両方で？
  //       想定ケース)
  //       - 味方の手動退却 || 味方の死亡 -> 盤上から取り除かれてHP回復/出撃ゲージ空
  //       - 既に前の味方の攻撃で倒している敵を攻撃してしまう

  // Ally's act
  newAllies = newAllies.map(ally => {
    const newAlly = Object.assign({}, ally);

    if (!isUnitInBattle(newAlly)) {
      // TODO: 出撃ポイントの回復
      return newAlly;
    }

    const act = unitMethods.getAct(newAlly);
    let didAct = false;

    if (unitMethods.canDoAct(newAlly)) {
      const aimedUnit = choiceAimedUnit(newAlly, act, newAllies.concat(newEnemies));
      if (aimedUnit) {
        //console.debug(`${ newAlly.factionType }:${ newAlly.jobId } aims ${ act.id } at ${ aimedUnit.factionType }:${ aimedUnit.jobId }`);

        // TODO: 効果を発生させる

        newAlly.actionPoints = unitMethods.calculateActionPointsConsumption(newAlly, act);

        didAct = true;
      }
    }

    if (!didAct) {
      // Recover AP
      const { actionPoints } = unitMethods.calculateActionPointsRecovery(newAlly);
      Object.assign(newAlly, { actionPoints });
    }

    return newAlly;
  });

  // Enemy's act or movement
  newEnemies = newEnemies.map(enemy => {
    const { location, destinationIndex } = unitMethods.calculateMovementResults(enemy);

    return Object.assign({}, enemy, {
      location,
      destinationIndex,
    });
  });

  return {
    allies: newAllies,
    enemies: newEnemies,
  };
};


module.exports = {
  canActorAimActAtTargetedUnit,
  choiceAimedUnit,
  computeTick,
  coordinateToSquareLocation,
  coordinateToRect,
  createReachableRects,
  findOneSquareFromBoardsByPlacement,
  willActorAimActAtUnit,
};
