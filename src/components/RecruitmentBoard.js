const React = require('react');
const { connect } = require('react-redux');

const { PARAMETERS } = require('../immutable/constants');
const Board = require('./presentational/Board');
const SquareMatrix = require('./presentational/SquareMatrix');


class RecruitmentBoard extends React.Component {
  render() {
    return <Board
      rowLength={ PARAMETERS.RECRUITMENT_BOARD_ROW_LENGTH }
      columnLength={ PARAMETERS.RECRUITMENT_BOARD_COLUMN_LENGTH }
      additionalClassNames={ ['root__recruitment-board'] }
    >
      <SquareMatrix squareMatrix={ [] } />
    </Board>;
  }
}

RecruitmentBoard = connect(state => state)(RecruitmentBoard);


module.exports = RecruitmentBoard;
