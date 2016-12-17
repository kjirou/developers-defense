const React = require('react');
const ReactDOM = require('react-dom');
const { Provider } = require('react-redux');
const { createStore, applyMiddleware } = require('redux');
const thunkMiddleware = require('redux-thunk').default;

const { initializeApp, runTicks } =  require('./action-creators');
const Root =  require('./components/Root');
const reducer =  require('./reducers');


window.document.addEventListener('DOMContentLoaded', () => {
  const store = createStore(
    reducer,
    applyMiddleware(thunkMiddleware)
  );

  window._store = store;  // For debug

  const app = React.createElement(
    Provider,
    { store },
    React.createElement(Root),
  );

  const placement = window.document.querySelector('.js-dd-container');
  ReactDOM.render(app, placement, () => {
    store.dispatch(initializeApp());
    store.dispatch(runTicks());
  });
});
