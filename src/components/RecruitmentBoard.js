const React = require('react');
const { connect } = require('react-redux');

const Board = require('./presentational/Board');
const SquareMatrix = require('./presentational/SquareMatrix');


class RecruitmentBoard extends React.Component {
  render() {
    return <div className="root__recruitment-board"></div>;
  }
}

RecruitmentBoard = connect(state => state)(RecruitmentBoard);


module.exports = RecruitmentBoard;
