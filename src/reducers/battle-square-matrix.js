const { ACTION_TYPES, LANDFORM_TYPES, PARAMETERS } = require('../immutable/constants');
const { createNewSquareMatrixState, extendSquareMatrix } = require('../state-models/square-matrix');


const createInitialState = () => {
  return createNewSquareMatrixState(
    PARAMETERS.BATTLE_BOARD_ROW_LENGTH, PARAMETERS.BATTLE_BOARD_COLUMN_LENGTH);
};

/**
 * @param {string} mapSymbol - A single character string
 * @return {?string}
 */
const parseMapSymbol = (mapSymbol) => {
  return {
    'C': LANDFORM_TYPES.CASTLE,
    '.': LANDFORM_TYPES.GRASSFIELD,
    'F': LANDFORM_TYPES.FORT,
    ' ': LANDFORM_TYPES.ROAD,
  }[mapSymbol] || null;
};

/**
 * @param {string} mapText
 * @return {Object[]} An object list to use as the `extendSquareMatrix`
 */
const parseMapText = (mapText) => {
  return mapText.trim().split('\n')
    .map(line => {
      return line.split('').map(mapSymbol => {
        const landformType = parseMapSymbol(mapSymbol);
        if (landformType === null) {
          throw new Error(`map-symbol=${ mapSymbol } is not defined`);
        }
        return { landformType };
      });
    })
  ;
};


const updateAllSquares = (state, { updates }) => {
  return extendSquareMatrix(state, updates);
};

const initialState = createInitialState();
const reduceBattleSquareMatrix = (state = initialState, action) => {
  switch (action.type || '') {
    case ACTION_TYPES.UPDATE_ALL_SQUARES:
      return updateAllSquares(state, action);
    default:
      return state;
  }
};

module.exports = {
  _createInitialState: createInitialState,
  parseMapText,
  reduceBattleSquareMatrix,
};
