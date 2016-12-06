const React = require('react');
const ReactDOM = require('react-dom');
const { Provider } = require('react-redux');
const { createStore, applyMiddleware } = require('redux');
const thunkMiddleware = require('redux-thunk').default;

const { runTicks } =  require('./action-creators');
const RootContainer =  require('./components/RootContainer');
const reducer =  require('./reducers');


window.document.addEventListener('DOMContentLoaded', () => {
  const store = createStore(
    reducer,
    applyMiddleware(thunkMiddleware)
  );

  const app = React.createElement(
    Provider,
    { store },
    React.createElement(RootContainer),
  );

  const placement = window.document.querySelector('.js-dd-container');
  ReactDOM.render(app, placement, () => {
    store.dispatch(runTicks());
  });
});
