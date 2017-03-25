// @flow

const { createStore, applyMiddleware } = require('redux');
const thunkMiddleware = require('redux-thunk').default;

const { ACTION_TYPES } =  require('../immutable/constants');
const reducer =  require('../reducers');


const loggerMiddleware = store => {
  return next => {
    return action => {
      if ([
        ACTION_TYPES.TICK,
      ].indexOf(action.type) === -1) {
        console.log('dispatching:', action);
      };
      return next(action);
    };
  };
}


const configureStore = () => {
  return createStore(
    reducer,
    applyMiddleware(thunkMiddleware, loggerMiddleware)
  );
};


module.exports = {
  configureStore,
};
