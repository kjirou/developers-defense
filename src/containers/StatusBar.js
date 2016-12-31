const React = require('react');
const { connect } = require('react-redux');


let StatusBar = ({ gameStatus }) => {
  return <div className="root__status-bar">
    <ul>
      <li>Progress: { gameStatus.progress } / { gameStatus.maxProgress }</li>
      <li>TD: { gameStatus.technicalDebt } / { gameStatus.maxTechnicalDebt }</li>
    </ul>
  </div>;
};

StatusBar = connect(state => state)(StatusBar);

module.exports = StatusBar;
