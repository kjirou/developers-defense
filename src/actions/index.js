/** @module */
const { ACTION_TYPES, BOARD_TYPES, PARAMETERS, STYLES } = require('../immutable/constants');
const { JOB_IDS } = require('../immutable/jobs');
const complexApisMethods = require('../state-models/complex-apis');
const locationMethods = require('../state-models/location');
const placementMethods = require('../state-models/placement');
const squareMatrixMethods = require('../state-models/square-matrix');
const unitMethods = require('../state-models/unit');
const unitCollectionMethods = require('../state-models/unit-collection');


const clearCursor = () => {
  return {
    type: ACTION_TYPES.CLEAR_CURSOR,
  };
};

const moveCursor = (placement) => {
  return {
    type: ACTION_TYPES.MOVE_CURSOR,
    placement,
  };
};

const extendGameStatus = (extension) => {
  return {
    type: ACTION_TYPES.EXTEND_GAME_STATUS,
    extension,
  };
};

const updateAlly = (ally) => {
  return {
    type: ACTION_TYPES.UPDATE_ALLY,
    ally,
  };
};

const updateAllies = (allies) => {
  return {
    type: ACTION_TYPES.UPDATE_ALLIES,
    allies,
  };
};

const updateEnemies = (enemies) => {
  return {
    type: ACTION_TYPES.UPDATE_ENEMIES,
    enemies,
  };
};

const tick = (tickId, allies, enemies) => {
  return {
    type: ACTION_TYPES.TICK,
    tickId,
    allies,
    enemies,
  };
};


/**
 * @param {State~Placement} placement
 */
const touchSquare = (newPlacement) => {
  return (dispatch, getState) => {
    const { cursor, sortieBoard, allies, battleBoard } = getState();
    const currentPlacement = cursor.placement;
    const isCurrentPlacementPlacedOnBoard = placementMethods.isPlacedOnBoard(currentPlacement);
    const currentSquare = complexApisMethods.findOneSquareFromBoardsByPlacement(currentPlacement, sortieBoard, battleBoard);
    const newSquare = complexApisMethods.findOneSquareFromBoardsByPlacement(newPlacement, sortieBoard, battleBoard);
    const currentCursorHittingAlly = unitCollectionMethods.findUnitsByPlacement(allies, currentPlacement)[0] || null;
    const newCursorHittingAlly = unitCollectionMethods.findUnitsByPlacement(allies, newPlacement)[0] || null;

    // TODO: Probably, it becomes very verbose...

    // Make an ally sortie
    if (
      currentPlacement.boardType === BOARD_TYPES.SORTIE_BOARD &&
      newPlacement.boardType === BOARD_TYPES.BATTLE_BOARD &&
      currentCursorHittingAlly &&
      !newCursorHittingAlly
    ) {
      const movedAlly = Object.assign({}, currentCursorHittingAlly, {
        placement: newPlacement,
      });
      dispatch(updateAlly(movedAlly));
      dispatch(clearCursor());

    // Make an ally retreat
    } else if (
      currentPlacement.boardType === BOARD_TYPES.BATTLE_BOARD &&
      newPlacement.boardType === BOARD_TYPES.SORTIE_BOARD &&
      currentCursorHittingAlly &&
      !newCursorHittingAlly
    ) {
      const movedAlly = Object.assign({}, currentCursorHittingAlly, {
        placement: newPlacement,
      });
      dispatch(updateAlly(movedAlly));
      dispatch(clearCursor());

    // Move the position of an ally in the sortie-board
    } else if (
      currentPlacement.boardType === BOARD_TYPES.SORTIE_BOARD &&
      newPlacement.boardType === BOARD_TYPES.SORTIE_BOARD &&
      currentCursorHittingAlly &&
      !newCursorHittingAlly
    ) {
      const movedAlly = Object.assign({}, currentCursorHittingAlly, {
        placement: newPlacement,
      });
      dispatch(updateAlly(movedAlly));
      dispatch(clearCursor());

    // Exchange the positions of allies in the sortie-board
    } else if (
      currentPlacement.boardType === BOARD_TYPES.SORTIE_BOARD &&
      newPlacement.boardType === BOARD_TYPES.SORTIE_BOARD &&
      currentCursorHittingAlly &&
      newCursorHittingAlly
    ) {
      const movedAllyA = Object.assign({}, currentCursorHittingAlly, {
        placement: newPlacement,
      });
      const movedAllyB = Object.assign({}, newCursorHittingAlly, {
        placement: currentPlacement,
      });
      dispatch(updateAlly(movedAllyA));
      dispatch(updateAlly(movedAllyB));
      dispatch(clearCursor());

    // Just the cursor disappears
    } else if (placementMethods.areSamePlacements(newPlacement, currentPlacement)) {
      dispatch(clearCursor());

    // Just move the cursor
    } else {
      dispatch(moveCursor(newPlacement));
    }
  };
};

/**
 * TODO: Probably, that is not correct as an Action Creator.
 *       I think that is an "Action Creator Creator".
 */
const startGame = () => {
  return (dispatch, getState) => {
    dispatch(extendGameStatus({ tickId: 0 }));

    const reserveTickTask = () => {
      setTimeout(() => {
        const { allies, enemies, gameStatus } = getState();

        if (gameStatus.isPaused) {
          reserveTickTask();
          return;
        }

        const newState = complexApisMethods.computeTick({ allies, enemies, gameStatus });

        dispatch(tick(
          gameStatus.tickId + 1,
          newState.allies,
          newState.enemies
        ));

        reserveTickTask();
      }, PARAMETERS.TICK_INTERVAL);
    };
    reserveTickTask();
  };
};

/**
 * @return {Function}
 */
const initializeApp = () => {
  const mapText = [
    '..... .',
    '.F     ',
    '. ... .',
    '. ... .',
    '. ... .',
    '. ... .',
    '. .F. .',
    '.C    .',
    '.......',
  ].join('\n');
  const squareMatrixExtension = squareMatrixMethods.parseMapText(mapText);

  const allies = unitCollectionMethods.createNewUnitCollectionState().concat([
    Object.assign(unitMethods.createNewAllyState(), {
      jobId: JOB_IDS.FIGHTER,
      placement: placementMethods.createNewPlacementState(BOARD_TYPES.SORTIE_BOARD, [0, 0]),
    }),
    Object.assign(unitMethods.createNewAllyState(), {
      jobId: JOB_IDS.HEALER,
      placement: placementMethods.createNewPlacementState(BOARD_TYPES.SORTIE_BOARD, [0, 1]),
    }),
    Object.assign(unitMethods.createNewAllyState(), {
      jobId: JOB_IDS.MAGE,
      placement: placementMethods.createNewPlacementState(BOARD_TYPES.SORTIE_BOARD, [1, 3]),
    }),
  ]).map(ally => {
    return Object.assign({}, ally, {
      hitPoints: unitMethods.getMaxHitPoints(ally),
    });
  });

  const enemies = unitCollectionMethods.createNewUnitCollectionState().concat([
    Object.assign(unitMethods.createNewEnemyState(), {
      jobId: JOB_IDS.FIGHTER,
      destinations: [
        locationMethods.createNewLocationState(0 * 48, 5 * 48),
        locationMethods.createNewLocationState(7 * 48, 5 * 48),
        locationMethods.createNewLocationState(7 * 48, 1 * 48),
      ],
    }),
    Object.assign(unitMethods.createNewEnemyState(), {
      jobId: JOB_IDS.MAGE,
      destinations: [
        locationMethods.createNewLocationState(-2 * 48, 5 * 48),
        locationMethods.createNewLocationState(7 * 48, 5 * 48),
        locationMethods.createNewLocationState(7 * 48, 1 * 48),
      ],
    }),
  ]).map(enemy => {
    return Object.assign({}, enemy, {
      hitPoints: unitMethods.getMaxHitPoints(enemy),
    });
  });

  return (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EXTEND_BATTLE_BOARD_SQUARE_MATRIX, extension: squareMatrixExtension });
    dispatch(updateAllies(allies));
    dispatch(updateEnemies(enemies));
  };
};


module.exports = {
  extendGameStatus,
  initializeApp,
  startGame,
  touchSquare,
};
