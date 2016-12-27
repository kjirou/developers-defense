const { combineReducers } = require('redux');

const { reduceAllies } = require('./allies');
const { reduceBattleBoard } = require('./battle-board');
const { reduceCursor } = require('./cursor');
const { reduceGameStatus } = require('./game-status');
const { reduceSortieBoard } = require('./sortie-board');


const reduceApp = combineReducers({
  allies: reduceAllies,
  battleBoard: reduceBattleBoard,
  cursor: reduceCursor,
  gameStatus: reduceGameStatus,
  sortieBoard: reduceSortieBoard,
});


module.exports = reduceApp;
