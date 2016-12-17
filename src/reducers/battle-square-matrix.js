const { ACTION_TYPES, LANDFORM_TYPES, PARAMETERS } = require('../immutable/constants');
const { areSameSize2DArray } = require('../lib/core');


const createSquareState = (rowIndex, columnIndex) => {
  return {
    coordinate: [rowIndex, columnIndex],
    landformType: null,
  };
};

const createInitialState = () => {
  return Array.from({ length: PARAMETERS.BATTLE_BOARD_ROW_LENGTH }).map((notUsed, rowIndex) => {
    return Array.from({ length: PARAMETERS.BATTLE_BOARD_COLUMN_LENGTH }).map((notUsed, columnIndex) => {
      return createSquareState(rowIndex, columnIndex);
    });
  });
};


const findSquareByCoordinate = (squares, [ rowIndex, columnIndex ]) => {
  return squares[rowIndex][columnIndex];
};

const mapSquaresState = (squaresState, callback) => {
  return squaresState.map(rowSquares => {
    return rowSquares.map(square => {
      return callback(square);
    });
  });
};

const cloneSquares = (squares) => {
  return mapSquaresState(squares, (square) => {
    return Object.assign({}, square);
  });
};

/**
 * @param {Object} squareState
 * @param {Object} properties
 * @return {Object} A shallow-copied square state
 */
const extendSquareState = (squareState, properties) => {
  Object.keys(properties).forEach(key => {
    if (!squareState.hasOwnProperty(key)) {
      throw new Error(`key="${ key }" is not defined`);
    }
  });
  return Object.assign({}, squareState, properties);
};

/**
 * @param {Object[]} squaresState
 * @param {Object[]} propertiesMatrix - A 2D array of the same size as squares state
 */
const extendAllSquaresState = (squaresState, propertiesMatrix) => {
  if (!areSameSize2DArray(squaresState, propertiesMatrix)) {
    throw new Error('Both arrarys are not the same size');
  }

  return mapSquaresState(squaresState, (square) => {
    const updater = propertiesMatrix[square.coordinate[0]][square.coordinate[1]];
    return extendSquareState(square, updater);
  });
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
 * @return {Object[]} An object list to use as the `extendAllSquaresState`
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


const setLandformType = (state, { coordinate, landformType }) => {
  const newState = cloneSquares(state);
  const square = findSquareByCoordinate(newState, coordinate);
  square.landformType = landformType;
  return newState;
};

const updateAllSquares = (state, { updates }) => {
  return extendAllSquaresState(state, updates);
};

const initialState = createInitialState();
const reduceBattleSquareMatrix = (state = initialState, action) => {
  switch (action.type || '') {
    case ACTION_TYPES.SET_LANDFORM_TYPE:
      return setLandformType(state, action);
    case ACTION_TYPES.UPDATE_ALL_SQUARES:
      return updateAllSquares(state, action);
    default:
      return state;
  }
};

module.exports = {
  _createInitialState: createInitialState,
  _findSquareByCoordinate: findSquareByCoordinate,
  parseMapText,
  reduceBattleSquareMatrix,
};
