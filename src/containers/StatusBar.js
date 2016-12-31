const React = require('react');
const { connect } = require('react-redux');


let StatusBar = ({ gameStatus }) => {
  return <div className="root__status-bar">
    <ul>
      <li>Progress: { gameStatus.progress } / { gameStatus.maxProgress }</li>
    </ul>
  </div>;
};

StatusBar = connect(state => state)(StatusBar);


module.exports = StatusBar;
