const { combineReducers } = require('redux');

const { reduceAllies } = require('./allies');
const { reduceAlliesBoard } = require('./allies-board');
const { reduceBattleBoard } = require('./battle-board');
const { reduceCursor } = require('./cursor');
const { reduceGameStatus } = require('./game-status');


const reduceApp = combineReducers({
  allies: reduceAllies,
  alliesBoard: reduceAlliesBoard,
  battleBoard: reduceBattleBoard,
  cursor: reduceCursor,
  gameStatus: reduceGameStatus,
});


module.exports = reduceApp;
