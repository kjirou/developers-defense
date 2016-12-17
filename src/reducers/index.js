const { combineReducers } = require('redux');

const { reduceBattleSquareMatrix } = require('./battle-square-matrix');
const { reduceGameStatus } = require('./game-status');


const reduceApp = combineReducers({
  battleSquareMatrix: reduceBattleSquareMatrix,
  gameStatus: reduceGameStatus,
});


module.exports = reduceApp;
