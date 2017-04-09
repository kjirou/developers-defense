// @flow

const React = require('react');
const ReactDOM = require('react-dom');

const { initializeApp } =  require('./actions');
const config =  require('./config');
const App =  require('./containers/App');
const acts =  require('./immutable/acts');
const animations =  require('./immutable/animations');
const constants =  require('./constants');
const jobs =  require('./immutable/jobs');
const { configureStore } =  require('./store');


window.document.addEventListener('DOMContentLoaded', () => {
  const store = configureStore();

  // For development on your browser
  window._config = config;
  window._constants = constants;
  window._immutable = {
    acts,
    animations,
    jobs,
  };
  window._store = store;

  const app = React.createElement(App, { store });

  const appContainer = window.document.querySelector('.js-dd-container');

  ReactDOM.render(app, appContainer, () => {
    store.dispatch(initializeApp());
  });
});
