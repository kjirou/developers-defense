const { ACTION_TYPES, BOARD_TYPES, FACTION_TYPES, PARAMETERS } = require('../immutable/constants');
const { JOB_IDS } = require('../immutable/jobs');
const { parseMapText } = require('../reducers/battle-square-matrix');
const { areSamePlace } = require('../state-computers/placement');
const { findSquareByCoordinate } = require('../state-computers/square-matrix');
const { createInitialUnitState } = require('../state-computers/unit');


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

/**
 * @param {State~Placement} placement
 */
const touchSquare = (placement) => {
  return (dispatch, getState) => {
    const { cursor } = getState();
    if (areSamePlace(placement, cursor.placement)) {
      dispatch(clearCursor());
    } else {
      dispatch(moveCursor(placement));
    }
  };
};

const placeUnitToSquare = (squareUid, unitUid) => {
  dispatch({
    type: ACTION_TYPES.PLACE_UNIT_TO_SQUARE,
    squareUid,
    unitUid,
  });
};

/**
 * @return {Function}
 */
const runTicks = () => {
  const tickPerSecond = 25;
  const interval = Math.round(1000 / tickPerSecond);

  const computeState = (dispatch, state) => {
    const tickId = state.gameStatus.tickId;

    if (tickId % tickPerSecond === 0) {
      dispatch({ type: ACTION_TYPES.ALTER_PROGRESS, delta: 1 });
      dispatch({ type: ACTION_TYPES.ALTER_TECHNICAL_DEBT, delta: 1 });
    }
  };

  return (dispatch, getState) => {
    const tick = () => {
      setTimeout(() => {
        dispatch({ type: ACTION_TYPES.TICK });
        computeState(dispatch, getState());
        tick();
      }, interval);
    };
    tick();
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
  const squareUpdates = parseMapText(mapText);

  const allies = [
    Object.assign(createInitialUnitState(), {
      factionType: FACTION_TYPES.ALLY,
      jobId: JOB_IDS.FIGHTER,
      placement: { boardType: BOARD_TYPES.ALLIES_BOARD, coordinate: [0, 0] },
    }),
    Object.assign(createInitialUnitState(), {
      factionType: FACTION_TYPES.ALLY,
      jobId: JOB_IDS.HEALER,
      placement: { boardType: BOARD_TYPES.ALLIES_BOARD, coordinate: [0, 1] },
    }),
    Object.assign(createInitialUnitState(), {
      factionType: FACTION_TYPES.ALLY,
      jobId: JOB_IDS.MAGE,
      placement: { boardType: BOARD_TYPES.ALLIES_BOARD, coordinate: [1, 3] },
    }),
  ];

  return (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.UPDATE_ALL_SQUARES, updates: squareUpdates });
    dispatch({ type: ACTION_TYPES.UPDATE_ALLIES, units: allies });
  };
};


module.exports = {
  initializeApp,
  runTicks,
  touchSquare,
};
