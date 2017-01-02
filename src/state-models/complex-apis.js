/** @module */
const { BOARD_TYPES } = require('../immutable/constants');
const { findSquareByCoordinate } = require('./square-matrix');
const {
  calculateAttackChargeResult,
  calculateMovementResults,
} = require('./unit');


/**
 * @return {State~Square[]}
 */
const findSquaresFromBoardsByPlacement = (placement, ...boards) => {
  const squares = [];

  boards
    .filter(board => placement.boardType === board.boardType)
    .forEach(board => {
      const square = findSquareByCoordinate(board.squareMatrix, placement.coordinate);
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
 * Compute the state transition during the "tick"
 * <section>
 *   The "tick" is a coined word, which means so-called "one game loop".
 * </section>
 * @param {Object} state - A state generated from `store.getState()`
 * @return {Object}
 */
const computeTick = ({ allies, enemies, gameStatus }) => {
  const newAllies = allies.map(ally => {
    const { attackCharge } = calculateAttackChargeResult(ally);

    return Object.assign({}, ally, {
      attackCharge,
    });
  });

  const newEnemies = enemies.map(enemy => {
    const { location, destinationIndex } = calculateMovementResults(enemy);

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
  computeTick,
  findOneSquareFromBoardsByPlacement,
};
