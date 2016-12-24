const { combineReducers } = require('redux');

const { reduceAlliesBoard } = require('./allies-board');
const { reduceAllyCollection } = require('./ally-collection');
const { reduceBattleBoard } = require('./battle-board');
const { reduceCursor } = require('./cursor');
const { reduceGameStatus } = require('./game-status');


const reduceApp = combineReducers({
  alliesBoard: reduceAlliesBoard,
  allyCollection: reduceAllyCollection,
  battleBoard: reduceBattleBoard,
  cursor: reduceCursor,
  gameStatus: reduceGameStatus,
});


module.exports = reduceApp;
