const { ACTION_TYPES, PARAMETERS } = require('../consts');


const _createInitialState = () => {
  return {
    maxProgress: PARAMETERS.MAX_PROGRESS,
    maxTechnicalDebt: PARAMETERS.MAX_TECHNICAL_DEBT,
    progress: PARAMETERS.MIN_PROGRESS,
    technicalDebt: PARAMETERS.MIN_TECHNICAL_DEBT,
  };
};

const _alterLimitedValue = (value, delta, min, max) => {
  return Math.min(max, Math.max(min, value + delta));
};

const _alterProgress = (state, { delta }) => {
  return Object.assign({}, state, {
    progress: _alterLimitedValue(
      state.progress, delta, PARAMETERS.MIN_PROGRESS, PARAMETERS.MAX_PROGRESS),
  });
};

const _alterTechnicalDebt = (state, { delta }) => {
  return Object.assign({}, state, {
    technicalDebt: _alterLimitedValue(
      state.technicalDebt, delta, PARAMETERS.MIN_TECHNICAL_DEBT, PARAMETERS.MAX_TECHNICAL_DEBT),
  });
};

const initialState = _createInitialState();
const reduceGameStatus = (state = initialState, action) => {
  return {
    [ACTION_TYPES.ALTER_PROGRESS]: _alterProgress(state, action),
    [ACTION_TYPES.ALTER_TECHNICAL_DEBT]: _alterTechnicalDebt(state, action),
  }[action.type] || state;
};

module.exports = {
  _createInitialState,
  reduceGameStatus,
};
