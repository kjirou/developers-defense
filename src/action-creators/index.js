const { ACTION_TYPES, PARAMETERS } = require('../immutable/constants');
const { parseMapText } = require('../reducers/battle-square-matrix');


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

  return (dispatch) => {
    dispatch({ type: ACTION_TYPES.UPDATE_ALL_SQUARES, updates: squareUpdates });
  };
};


module.exports = {
  initializeApp,
  runTicks,
};
