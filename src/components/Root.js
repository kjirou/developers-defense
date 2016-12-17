const React = require('react');

const BattleBoard = require('./BattleBoard');
const RecruitmentBoard = require('./RecruitmentBoard');
const StatusBar = require('./StatusBar');


class Root extends React.Component {
  render() {
    return (
      <div className="root">
        <StatusBar />
        <BattleBoard />
        <RecruitmentBoard />
      </div>
    );
  }
}


module.exports = Root;
