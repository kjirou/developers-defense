const { combineReducers } = require('redux');

const { reduceAllies } = require('./allies');
const { reduceAlliesSquareMatrix } = require('./allies-square-matrix');
const { reduceBattleSquareMatrix } = require('./battle-square-matrix');
const { reduceEnemies } = require('./enemies');
const { reduceGameStatus } = require('./game-status');


const reduceApp = combineReducers({
  allies: reduceAllies,
  alliesSquareMatrix: reduceAlliesSquareMatrix,
  battleSquareMatrix: reduceBattleSquareMatrix,
  enemies: reduceEnemies,
  gameStatus: reduceGameStatus,
});


module.exports = reduceApp;
