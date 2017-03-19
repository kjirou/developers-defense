// @flow

const React = require('react');

const BattleBoard = require('../containers/BattleBoard');
const DebugButtons = require('../containers/DebugButtons');
const SortieBoard = require('../containers/SortieBoard');
const StatusBar = require('../containers/StatusBar');


const Root = () => {
  return (
    <div className="root">
      <StatusBar />
      <BattleBoard />
      <SortieBoard />
      <DebugButtons />
    </div>
  );
};


module.exports = Root;
