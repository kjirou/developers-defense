const { createStore, applyMiddleware } = require('redux');
const thunkMiddleware = require('redux-thunk').default;

const reducer =  require('../reducers');


const loggerMiddleware = store => {
  return next => {
    return action => {
      if ([
        'ALTER_PROGRESS',
        'ALTER_TECHNICAL_DEBT',
        'TICK',
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
