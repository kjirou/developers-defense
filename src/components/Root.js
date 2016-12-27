const React = require('react');

const BattleBoard = require('./BattleBoard');
const SortieBoard = require('./SortieBoard');
const StatusBar = require('./StatusBar');


class Root extends React.Component {
  render() {
    return (
      <div className="root">
        <StatusBar />
        <BattleBoard />
        <SortieBoard />
      </div>
    );
  }
}


module.exports = Root;
