const { combineReducers } = require('redux');

const { reduceGameStatus } = require('./game-status');


const reduceApp = combineReducers({
  gameStatus: reduceGameStatus,
});

module.exports = reduceApp;
