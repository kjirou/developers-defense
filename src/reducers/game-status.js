const { ACTION_TYPES, PARAMETERS } = require('../immutable/constants');


const _createInitialState = () => {
  return {
    tickId: 0,
    maxProgress: PARAMETERS.MAX_PROGRESS,
    maxTechnicalDebt: PARAMETERS.MAX_TECHNICAL_DEBT,
    progress: PARAMETERS.MIN_PROGRESS,
    technicalDebt: PARAMETERS.MIN_TECHNICAL_DEBT,
  };
};

const alterLimitedValue = (value, delta, min, max) => {
  return Math.min(max, Math.max(min, value + delta));
};

const alterProgress = (state, { delta }) => {
  return Object.assign({}, state, {
    progress: alterLimitedValue(
      state.progress, delta, PARAMETERS.MIN_PROGRESS, PARAMETERS.MAX_PROGRESS),
  });
};

const alterTechnicalDebt = (state, { delta }) => {
  return Object.assign({}, state, {
    technicalDebt: alterLimitedValue(
      state.technicalDebt, delta, PARAMETERS.MIN_TECHNICAL_DEBT, PARAMETERS.MAX_TECHNICAL_DEBT),
  });
};

const tick = (state) => {
  return Object.assign({}, state, {
    tickId: state.tickId + 1,
  });
};

const initialState = _createInitialState();
const reduceGameStatus = (state = initialState, action) => {
  switch (action.type || '') {
    case ACTION_TYPES.ALTER_PROGRESS:
      return alterProgress(state, action);
    case ACTION_TYPES.ALTER_TECHNICAL_DEBT:
      return alterTechnicalDebt(state, action);
    case ACTION_TYPES.TICK:
      return tick(state, action);
    default:
      return state;
  }
};

module.exports = {
  _createInitialState,
  reduceGameStatus,
};
