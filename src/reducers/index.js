const { combineReducers } = require('redux');

const { reduceAllies } = require('./allies');
const { reduceAlliesBoard } = require('./allies-board');
const { reduceBattleBoard } = require('./battle-board');
const { reduceCursor } = require('./cursor');
const { reduceEnemies } = require('./enemies');
const { reduceGameStatus } = require('./game-status');


const reduceApp = combineReducers({
  allies: reduceAllies,
  alliesBoard: reduceAlliesBoard,
  battleBoard: reduceBattleBoard,
  cursor: reduceCursor,
  enemies: reduceEnemies,
  gameStatus: reduceGameStatus,
});


module.exports = reduceApp;
