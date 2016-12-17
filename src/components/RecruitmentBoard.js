const React = require('react');
const { connect } = require('react-redux');

const Board = require('./presentational/Board');
const SquareMatrix = require('./presentational/SquareMatrix');


class RecruitmentBoard extends Board {
  render() {
    const styles = this.createBaseStyles();
    return <div className="root__recruitment-board" style={ styles }></div>;
  }
}

RecruitmentBoard = connect(state => state)(RecruitmentBoard);


module.exports = RecruitmentBoard;
