const React = require('react');
const ReactDOM = require('react-dom');
const { Provider } = require('react-redux');

const { initializeApp } =  require('./action-creators');
const Root =  require('./components/Root');
const { configureStore } =  require('./store');


/**
 * @namespace State
 */


window.document.addEventListener('DOMContentLoaded', () => {
  const store = configureStore();

  window._store = store;  // For debug

  const app = React.createElement(
    Provider,
    { store },
    React.createElement(Root)
  );

  const appContainer = window.document.querySelector('.js-dd-container');
  ReactDOM.render(app, appContainer, () => {
    store.dispatch(initializeApp());
  });
});
