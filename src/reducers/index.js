// @flow

const { combineReducers } = require('redux');

const { reduceAllies } = require('./allies');
const { reduceBattleBoard } = require('./battle-board');
const { reduceBullets } = require('./bullets');
const { reduceCursor } = require('./cursor');
const { reduceEnemies } = require('./enemies');
const { reduceGameStatus } = require('./game-status');
const { reduceSortieBoard } = require('./sortie-board');


const reduceApp = combineReducers({
  allies: reduceAllies,
  battleBoard: reduceBattleBoard,
  bullets: reduceBullets,
  cursor: reduceCursor,
  enemies: reduceEnemies,
  gameStatus: reduceGameStatus,
  sortieBoard: reduceSortieBoard,
});


module.exports = reduceApp;
