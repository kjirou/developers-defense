const React = require('react');
const { connect } = require('react-redux');

const { PARAMETERS } = require('../immutable/constants');


let StatusBar = ({ gameStatus }) => {
  const { tickId } = gameStatus;

  return <div className="root__status-bar">
    <ul>
      <li>Time: { tickId === null ? '--' : Math.floor(tickId / PARAMETERS.TICKS_PER_SECOND) }</li>
    </ul>
  </div>;
};

StatusBar = connect(state => state)(StatusBar);


module.exports = StatusBar;
