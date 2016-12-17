const React = require('react');
const { connect } = require('react-redux');

const Board = require('./presentational/Board');
const SquareMatrix = require('./presentational/SquareMatrix');


class BattleBoard extends Board {
  render() {
    const styles = this.createBaseStyles();
    return <div className="root__battle-board" style={ styles }>
      <SquareMatrix squareMatrix={ this.props.battleSquares } />
    </div>;
  }
}

BattleBoard = connect(state => state)(BattleBoard);

module.exports = BattleBoard;
