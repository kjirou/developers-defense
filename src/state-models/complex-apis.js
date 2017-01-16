/** @module */
const boxCollide = require('box-collide');

const config = require('../config');
const { ACT_AIM_RANGE_TYPES, ACT_EFFECT_RANGE_TYPES, BOARD_TYPES, FACTION_TYPES, FRIENDSHIP_TYPES, STYLES
  } = require('../immutable/constants');
const { expandReachToRelativeCoordinates } = require('../lib/core');
const bulletMethods = require('./bullet');
const coordinateMethods = require('./coordinate');
const effectMethods = require('./effect');
const locationMethods = require('./location');
const squareMatrixMethods = require('./square-matrix');
const unitMethods = require('./unit');


/**
 * @param {State~Coordinate}
 * @return {State~Location} A location of square
 */
const coordinateToSquareLocation = (coordinate) => {
  return locationMethods.createNewLocationState(
    coordinate[0] * STYLES.SQUARE_HEIGHT, coordinate[1] * STYLES.SQUARE_WIDTH);
};

/**
 * @param {State~Location} squareLocation
 * @return {{x, y, width, height}} This is mainly used to `substack/box-collide`
 * @todo Use State~Rectangle
 */
const squareLocationToRect = (squareLocation) => {
  return {
    x: squareLocation.x,
    y: squareLocation.y,
    width: STYLES.SQUARE_WIDTH,
    height: STYLES.SQUARE_HEIGHT,
  };
};

/**
 * @param {State~Coordinate} coordinate
 * @todo Use State~Rectangle
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
 * Detect collisions between rectangle and coordinate,
 *   assuming that the size of the square-matrix is infinite.
 * @param {State~Rectangle} rectangle
 * @param {State~Coordinate} endPointCoordinate
 * @return {State~Coordinate[]}
 */
const detectAllCollisionsBetweenRectangleAndCoordinate = (rectangle, endPointCoordinate) => {
  const collidedCoordinates = [];

  for (let rowIndex = 0; rowIndex <= endPointCoordinate[0]; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex <= endPointCoordinate[1]; columnIndex += 1) {
      const coordinate = coordinateMethods.createNewCoordinateState(rowIndex, columnIndex);
      if (boxCollide(rectangle, coordinateToRect(coordinate))) {
        collidedCoordinates.push(coordinate);
      }
    }
  }

  return collidedCoordinates;
};

/**
 * @param {State~Unit} actor
 * @param {State~Unit} targetedUnit
 * @param {State~Coordinate} endPointCoordinate
 * @return {?State~Coordinate}
 */
const choiceClosestCoordinateUnderTargetedUnit = (actor, targetedUnit, endPointCoordinate) => {
  const actorLocation = getUnitPositionAsLocation(actor);
  const targetedUnitLocation = getUnitPositionAsLocation(targetedUnit);
  const targetedUnitRectangle = squareLocationToRect(targetedUnitLocation);

  const candidates = detectAllCollisionsBetweenRectangleAndCoordinate(
    targetedUnitRectangle, endPointCoordinate);

  // Since enemies can only move up / down / left / right,
  //   it should not be more than 2 coordinates.
  // Ref) calculateMovementResults
  if (candidates.length !== 1 && candidates.length !== 2) {
    throw new Error('Enemy position is wrong');
  }

  // Sort in order of closeness
  return candidates.sort((a, b) => {
    const aLocation = coordinateToSquareLocation(a);
    const bLocation = coordinateToSquareLocation(b);
    const distanceToA = locationMethods.measureDistance(actorLocation, aLocation);
    const distanceToB = locationMethods.measureDistance(actorLocation, bLocation);

    if (distanceToA < distanceToB) {
      return -1;
    } else if (distanceToA > distanceToB) {
      return 1;
    }
    return 0;
  })[0] || null
};

/**
 * @param {State~Location} centerSquareLocation
 * @param {number} reach - A integer >= 0
 * @return {Array<{x, y, width, height}>}
 * @todo Remove overflowed coordinates from result?
 */
const createReachableRects = (centerSquareLocation, reach) => {
  return expandReachToRelativeCoordinates(0, reach)
    .map(relativeCoordinate =>
      locationMethods.addLocations(centerSquareLocation, coordinateToSquareLocation(relativeCoordinate))
    )
    .map(location => squareLocationToRect(location));
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
  return unit.placement.boardType === BOARD_TYPES.BATTLE_BOARD && unit.hitPoints > 0;
};

/**
 * @param {string} actFriendshipType - One of FRIENDSHIP_TYPES
 * @param {string} actorFactionType - One of FACTION_TYPES
 * @return {string[]} Some of FACTION_TYPES
 */
const judgeAffectableFractionTypes = (actFriendshipType, actorFactionType) => {
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
 * @param {Function} act
 * @param {State~Unit[]} units
 * @return {?State~Unit}
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
    const angleA = locationMethods.measureAngleWithTopAsZero(actorLocation, aLocation);
    const angleB = locationMethods.measureAngleWithTopAsZero(actorLocation, bLocation);
    if (angleA === null || angleA < angleB) {
      return -1;
    } else if (angleB === null || angleA > angleB) {
      return 1;
    }

    return 0;
  });

  return aimableUnits[0] || null;
};

/**
 * Create bullets carrying effects on each
 * @param {State~Unit} actor
 * @param {Function} act
 * @param {State~Unit} aimedUnit
 * @param {State~Coordinate} squareMatrixEndPointCoordinate
 * @param {(Object|undefined)} options
 * @param {?State~Effect} [options.effect] - Pass the effect from the outside. It is mainly for testing.
 * @return {State~Bullet[]}
 */
const fireBullets = (actor, act, aimedUnit, squareMatrixEndPointCoordinate, options = {}) => {
  const defaultedOptions = Object.assign({
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
      coordinateToSquareLocation(
        choiceClosestCoordinateUnderTargetedUnit(actor, aimedUnit, squareMatrixEndPointCoordinate)
      )
    );
  }

  let effect;
  if (options.effect) {
    effect = options.effect;
  } else {
    const effectOptions = {
      damagePoints: act.effectParameters.damagePoints,
      healingPoints: act.effectParameters.healingPoints,
    };
    if (act.effectRange.type === ACT_EFFECT_RANGE_TYPES.UNIT) {
      effectOptions.aimedUnitUid = aimedUnit.uid;
    } else {
      effectOptions.relativeCoordinates = [];
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

/**
 * @param {State~Effect} effect
 * @param {State~Unit[]} units
 * @return {{units:<State~Unit[]>, effectResults:<Array<{}>>}}
 */
const applyEffectToUnits = (effect, units) => {
  // TODO: 単体の場合の unit.uid 指定を優先する
  // TODO: 範囲の場合の範囲計算
  const newUnits = units.map(unit => {
    return unit;
  });

  return {
    units: newUnits,
    // TODO: 各種修正後の実ダメージ/回復値や、それがどの位置で誰に発生したかを記録する。主に表示用
    effectLogs: [],
  };
};

/**
 * Compute the state transition during the "tick"
 * <section>
 *   The "tick" is a coined word, which means so-called "one game loop".
 * </section>
 * @param {Object} state - A plain object generated from `store.getState()`
 * @return {Object}
 */
const computeTick = ({ allies, enemies, bullets, battleBoard, gameStatus }) => {
  const battleBoardEndPointCoordinate = squareMatrixMethods.getEndPointCoordinate(battleBoard.squareMatrix);

  let newBullets = bullets.slice();
  let newAllies = allies.slice();
  let newEnemies = enemies.slice();

  // TODO: 適宜、死亡者を盤上から除去する必要がある
  //       ユニットの状態を変えうる全ての行動後に必要になりそう
  //       - 弾の効果
  //       - バフやステージギミックの効果
  //       - プレイヤーの手動操作による効果（退却とか）

  // Bullets movement and effect
  newBullets = newBullets
    // Cleaning
    //   Since at least bullets are drawn for 2 ticks, do not clean at the end.
    .filter(bullet => !bulletMethods.isArrivedToDestination(bullet))
    // Movement
    .map(bullet => {
      return Object.assign({}, bullet, {
        location: bulletMethods.calculateNextLocation(bullet),
      });
    })
    // Effect
    .map(bullet => {
      if (!bulletMethods.isArrivedToDestination(bullet)) {
        return bullet;
      };

      const effectResult = applyEffectToUnits(bullet.effect, newAllies.concat(newEnemies));
      newAllies = effectResult.units.filter(unit => unit.factionType === FACTION_TYPES.ALLY);
      newEnemies = effectResult.units.filter(unit => unit.factionType === FACTION_TYPES.ENEMY);

      return bullet;
    })
  ;

  // Enemy's movement
  //   この処理は「弾の移動・効果発生」の後で、かつ「弾の発射」の前であることが望ましい。
  //   「弾の移動・効果発生」前に実行する場合、着弾場所と敵の位置が必ずずれることになるし、
  //   「弾の発射」後に実行する場合、照準がずれることになる。
  //   ということで、1 tick 分だが、プレイヤーにとって最も自然で有利になるから。
  newEnemies = newEnemies.map(enemy => {
    const { location, destinationIndex } = unitMethods.calculateMovementResults(enemy);

    return Object.assign({}, enemy, {
      location,
      destinationIndex,
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

    if (unitMethods.canDoAct(newAlly)) {
      const aimedUnit = choiceAimedUnit(newAlly, act, newAllies.concat(newEnemies));

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
    enemies: newEnemies,
    bullets: newBullets,
  };
};


module.exports = {
  applyEffectToUnits,
  canActorAimActAtTargetedUnit,
  choiceAimedUnit,
  choiceClosestCoordinateUnderTargetedUnit,
  computeTick,
  coordinateToSquareLocation,
  coordinateToRect,
  createReachableRects,
  detectAllCollisionsBetweenRectangleAndCoordinate,
  findOneSquareFromBoardsByPlacement,
  fireBullets,
  judgeAffectableFractionTypes,
  willActorAimActAtUnit,
};
