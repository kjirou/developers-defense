const React = require('react');

const AlliesBoard = require('./AlliesBoard');
const BattleBoard = require('./BattleBoard');
const StatusBar = require('./StatusBar');


class Root extends React.Component {
  render() {
    return (
      <div className="root">
        <StatusBar />
        <BattleBoard />
        <AlliesBoard />
      </div>
    );
  }
}


module.exports = Root;
