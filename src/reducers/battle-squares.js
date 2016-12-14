const { ACTION_TYPES, COIN_TYPES, PARAMETERS } = require('../consts');


const createInitialState = () => {
  return Array.from({ length: PARAMETERS.BATTLE_BOARD_ROW_LENGTH }).map((notUsed, rowIndex) => {
    return Array.from({ length: PARAMETERS.BATTLE_BOARD_COLUMN_LENGTH }).map((notUsed, columnIndex) => {
      return {
        matrix: [rowIndex, columnIndex],
        coinType: null,
      };
    });
  });
};

const cloneSquares = (squares) => {
  return squares.map(rowSquares => {
    return rowSquares.map(square => {
      return Object.assign({}, square, {
        matrix: square.matrix.slice(),
      });
    });
  });
};

const findSquareByMatrix = (squares, [ rowIndex, columnIndex ]) => {
  return squares[rowIndex][columnIndex];
};

const exchangeCoinLocations = (state, { fromMatrix, toMatrix }) => {
  const newState = cloneSquares(state);
  const fromSquare = findSquareByMatrix(newState, fromMatrix);
  const toSquare = findSquareByMatrix(newState, toMatrix);
  const fromSquareCoinType = fromSquare.coinType;
  const toSquareCoinType = toSquare.coinType;
  fromSquare.coinType = toSquareCoinType;
  toSquare.coinType = fromSquareCoinType;
  return newState;
};


const initialState = createInitialState();
const reduceBattleSquares = (state = initialState, action) => {
  switch (action.type || '') {
    case ACTION_TYPES.EXCHANGE_COIN_LOCATIONS:
      return exchangeCoinLocations(state, action);
    default:
      return state;
  }
};

module.exports = {
  _createInitialState: createInitialState,
  _findSquareByMatrix: findSquareByMatrix,
  reduceBattleSquares,
};
