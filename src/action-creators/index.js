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

const tick = () => {
  return {
    type: ACTION_TYPES.TICK,
  };
};


/**
 * @param {State~Placement} placement
 */
const touchSquare = (newPlacement) => {
  return (dispatch, getState) => {
    const { cursor, alliesBoard, allyCollection, battleBoard } = getState();
    const currentPlacement = cursor.placement;
    const isCurrentPlacementPlacedOnBoard = isPlacedOnBoard(currentPlacement);
    const currentSquare = findOneSquareFromBoardsByPlacement(currentPlacement, alliesBoard, battleBoard);
    const newSquare = findOneSquareFromBoardsByPlacement(newPlacement, alliesBoard, battleBoard);
    const currentCursorHittingAlly = findUnitsByPlacement(allyCollection, currentPlacement)[0] || null;
    const newCursorHittingAlly = findUnitsByPlacement(allyCollection, newPlacement)[0] || null;

    // TODO: Probably, it becomes very verbose...

    // Make an ally sortie
    if (
      currentPlacement.boardType === BOARD_TYPES.ALLIES_BOARD &&
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
      newPlacement.boardType === BOARD_TYPES.ALLIES_BOARD &&
      currentCursorHittingAlly &&
      !newCursorHittingAlly
    ) {
      const movedAlly = Object.assign({}, currentCursorHittingAlly, {
        placement: newPlacement,
      });
      dispatch(updateAlly(movedAlly));
      dispatch(clearCursor());

    // Move the position of an ally in the allies-board
    } else if (
      currentPlacement.boardType === BOARD_TYPES.ALLIES_BOARD &&
      newPlacement.boardType === BOARD_TYPES.ALLIES_BOARD &&
      currentCursorHittingAlly &&
      !newCursorHittingAlly
    ) {
      const movedAlly = Object.assign({}, currentCursorHittingAlly, {
        placement: newPlacement,
      });
      dispatch(updateAlly(movedAlly));
      dispatch(clearCursor());

    // Exchange the positions of allies in the allies-board
    } else if (
      currentPlacement.boardType === BOARD_TYPES.ALLIES_BOARD &&
      newPlacement.boardType === BOARD_TYPES.ALLIES_BOARD &&
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
 * @return {Function}
 */
const runTicks = () => {
  const ticksPerSecond = 25;
  const interval = Math.round(1000 / ticksPerSecond);

  const computeState = (dispatch, state) => {
    const tickId = state.gameStatus.tickId;

    if (tickId % ticksPerSecond === 0) {
      dispatch({ type: ACTION_TYPES.ALTER_PROGRESS, delta: 1 });
      dispatch({ type: ACTION_TYPES.ALTER_TECHNICAL_DEBT, delta: 1 });
    }
  };

  return (dispatch, getState) => {
    const tickTask = () => {
      setTimeout(() => {
        dispatch(tick());
        computeState(dispatch, getState());
        tickTask();
      }, interval);
    };
    tickTask();
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
    ' C    .',
    '. .....',
  ].join('\n');
  const squareMatrixExtension = parseMapText(mapText);

  const allyCollection = createNewUnitCollectionState().concat([
    Object.assign(createNewUnitState(), {
      factionType: FACTION_TYPES.ALLY,
      jobId: JOB_IDS.FIGHTER,
      placement: { boardType: BOARD_TYPES.ALLIES_BOARD, coordinate: [0, 0] },
    }),
    Object.assign(createNewUnitState(), {
      factionType: FACTION_TYPES.ALLY,
      jobId: JOB_IDS.HEALER,
      placement: { boardType: BOARD_TYPES.ALLIES_BOARD, coordinate: [0, 1] },
    }),
    Object.assign(createNewUnitState(), {
      factionType: FACTION_TYPES.ALLY,
      jobId: JOB_IDS.MAGE,
      placement: { boardType: BOARD_TYPES.ALLIES_BOARD, coordinate: [1, 3] },
    }),
  ]);

  return (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EXTEND_BATTLE_BOARD_SQUARE_MATRIX, extension: squareMatrixExtension });
    dispatch({ type: ACTION_TYPES.UPDATE_ALLY_COLLECTION, allyCollection });
  };
};


module.exports = {
  initializeApp,
  runTicks,
  touchSquare,
};
