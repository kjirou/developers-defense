const React = require('react');

const Board = require('./presentational/Board');


class RecruitmentBoard extends Board {
  render() {
    const styles = this.createBaseStyles();
    return <div className="root__recruitment-board" style={ styles }>
      { this.createSquares() }
    </div>;
  }
}

module.exports = RecruitmentBoard;
