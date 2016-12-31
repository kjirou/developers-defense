const React = require('react');

const BattleBoard = require('../containers/BattleBoard');
const SortieBoard = require('../containers/SortieBoard');
const StatusBar = require('../containers/StatusBar');


const Root = () => {
  return (
    <div className="root">
      <StatusBar />
      <BattleBoard />
      <SortieBoard />
    </div>
  );
};


module.exports = Root;
