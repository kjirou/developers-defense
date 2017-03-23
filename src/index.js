const React = require('react');
const ReactDOM = require('react-dom');
const { Provider } = require('react-redux');

const { initializeApp } =  require('./actions');
const Root =  require('./components/Root');
const config =  require('./config');
const acts =  require('./immutable/acts');
const animations =  require('./immutable/animations');
const constants =  require('./immutable/constants');
const jobs =  require('./immutable/jobs');
const { configureStore } =  require('./store');


window.document.addEventListener('DOMContentLoaded', () => {
  const store = configureStore();

  // For development on your browser
  window._config = config;
  window._immutable = {
    acts,
    animations,
    constants,
    jobs,
  };
  window._store = store;

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
