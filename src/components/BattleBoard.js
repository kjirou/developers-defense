const React = require('react');

const Board = require('./presentational/Board');


class BattleBoard extends Board {
  render() {
    const styles = this.createBaseStyles();
    return <div className="root__battle-board" style={ styles }>
      { this.createSquares() }
    </div>;
  }
}

module.exports = BattleBoard;
