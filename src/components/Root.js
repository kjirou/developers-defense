const React = require('react');

const { PARAMETERS, STYLES } = require('../consts');
const BattleBoard = require('./BattleBoard');
const RecruitmentBoard = require('./RecruitmentBoard');
const StatusBar = require('./StatusBar');


class Root extends React.Component {
  render() {
    return (
      <div className="root">
        <StatusBar />
        <BattleBoard />
      </div>
    );
  }
}

//        <RecruitmentBoard
//          rowLength={ PARAMETERS.RECRUITMENT_BOARD_ROW_LENGTH }
//          columnLength={ PARAMETERS.RECRUITMENT_BOARD_COLUMN_LENGTH }
//        />

module.exports = Root;
