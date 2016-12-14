const { combineReducers } = require('redux');

const { reduceBattleSquares } = require('./battle-squares');
const { reduceGameStatus } = require('./game-status');


const reduceApp = combineReducers({
  battleSquares: reduceBattleSquares,
  gameStatus: reduceGameStatus,
});


module.exports = reduceApp;
