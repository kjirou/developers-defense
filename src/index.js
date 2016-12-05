const React = require('react');
const ReactDOM = require('react-dom');
const { Provider } = require('react-redux');
const { createStore } = require('redux');

const RootContainer =  require('./components/RootContainer');
const reducer =  require('./reducers');


window.document.addEventListener('DOMContentLoaded', () => {
  const store = createStore(reducer);
  const app = React.createElement(
    Provider,
    { store },
    React.createElement(RootContainer),
  );
  const placement = window.document.querySelector('.js-dd-container');
  ReactDOM.render(app, placement);
});
