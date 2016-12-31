const { ACTION_TYPES, BOARD_TYPES, FACTION_TYPES, PARAMETERS } = require('../immutable/constants');
const { JOB_IDS } = require('../immutable/jobs');
const { findOneSquareFromBoardsByPlacement } = require('../state-models/complex-apis');
const { areSamePlace, isPlacedOnBoard } = require('../state-models/placement');
const { findSquareByCoordinate, parseMapText } = require('../state-models/square-matrix');
const { createNewUnitState } = require('../state-models/unit');
const { createNewUnitCollectionState, findUnitsByPlacement } = require('../state-models/unit-collection');


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

const updateAlly = (ally) => {
  return {
    type: ACTION_TYPES.UPDATE_ALLY,
    ally,
  };
};

const updateTickId = (tickId) => {
  return {
    type: ACTION_TYPES.UPDATE_TICK_ID,
    tickId,
  };
};


/**
 * @param {State~Placement} placement
 */
const touchSquare = (newPlacement) => {
  return (dispatch, getState) => {
    const { cursor, sortieBoard, allies, battleBoard } = getState();
    const currentPlacement = cursor.placement;
    const isCurrentPlacementPlacedOnBoard = isPlacedOnBoard(currentPlacement);
    const currentSquare = findOneSquareFromBoardsByPlacement(currentPlacement, sortieBoard, battleBoard);
    const newSquare = findOneSquareFromBoardsByPlacement(newPlacement, sortieBoard, battleBoard);
    const currentCursorHittingAlly = findUnitsByPlacement(allies, currentPlacement)[0] || null;
    const newCursorHittingAlly = findUnitsByPlacement(allies, newPlacement)[0] || null;

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
    } else if (areSamePlace(newPlacement, currentPlacement)) {
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
    dispatch(updateTickId(0));

    const reserveTickTask = () => {
      setTimeout(() => {
        const { gameStatus } = getState();
        const { tickId } = gameStatus;

        dispatch(updateTickId(tickId + 1));

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
  const squareMatrixExtension = parseMapText(mapText);

  const allies = createNewUnitCollectionState().concat([
    Object.assign(createNewUnitState(), {
      factionType: FACTION_TYPES.ALLY,
      jobId: JOB_IDS.FIGHTER,
      placement: { boardType: BOARD_TYPES.SORTIE_BOARD, coordinate: [0, 0] },
    }),
    Object.assign(createNewUnitState(), {
      factionType: FACTION_TYPES.ALLY,
      jobId: JOB_IDS.HEALER,
      placement: { boardType: BOARD_TYPES.SORTIE_BOARD, coordinate: [0, 1] },
    }),
    Object.assign(createNewUnitState(), {
      factionType: FACTION_TYPES.ALLY,
      jobId: JOB_IDS.MAGE,
      placement: { boardType: BOARD_TYPES.SORTIE_BOARD, coordinate: [1, 3] },
    }),
  ]);

  const enemies = createNewUnitCollectionState().concat([
    Object.assign(createNewUnitState(), {
      factionType: FACTION_TYPES.ENEMY,
      jobId: JOB_IDS.FIGHTER,
      location: [0, 48 * 5],
      destinations: [[7, 5], [7, 2]],
      currentDestinationIndex: 0,
    }),
  ]);

  return (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EXTEND_BATTLE_BOARD_SQUARE_MATRIX, extension: squareMatrixExtension });
    dispatch({ type: ACTION_TYPES.UPDATE_ALLIES, allies });
    dispatch({ type: ACTION_TYPES.UPDATE_ENEMIES, enemies });
  };
};


module.exports = {
  initializeApp,
  startGame,
  touchSquare,
};
