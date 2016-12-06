const React = require('react');

const { PARAMETERS, STYLES } = require('../consts');
const BattleBoard = require('./BattleBoard');
const RecruitmentBoard = require('./RecruitmentBoard');
const StatusBar = require('./StatusBar');
const Square = require('./presentational/Square');


const SquareMonitor = () => {
  return <div className="root__square-monitor">SquareMonitor</div>;
};

class Root extends React.Component {
  render() {
    return (
      <div className="root">
        <StatusBar />
        <BattleBoard
          rowLength={ PARAMETERS.BATTLE_BOARD_ROW_LENGTH }
          columnLength={ PARAMETERS.BATTLE_BOARD_COLUMN_LENGTH }
        />
        <RecruitmentBoard
          rowLength={ PARAMETERS.RECRUITMENT_BOARD_ROW_LENGTH }
          columnLength={ PARAMETERS.RECRUITMENT_BOARD_COLUMN_LENGTH }
        />
        <SquareMonitor />
      </div>
    );
  }
}

module.exports = Root;
