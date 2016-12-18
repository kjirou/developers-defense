const { combineReducers } = require('redux');

const { reduceAllies } = require('./allies');
const { reduceBattleSquareMatrix } = require('./battle-square-matrix');
const { reduceEnemies } = require('./enemies');
const { reduceGameStatus } = require('./game-status');


const reduceApp = combineReducers({
  allies: reduceAllies,
  battleSquareMatrix: reduceBattleSquareMatrix,
  enemies: reduceEnemies,
  gameStatus: reduceGameStatus,
});


module.exports = reduceApp;
