const React = require('react');
const { connect } = require('react-redux');

const { PARAMETERS } = require('../consts');
const Board = require('./presentational/Board');
const SquareMatrix = require('./presentational/SquareMatrix');


class BattleBoard extends React.Component {
  render() {
    return <Board
      rowLength={ PARAMETERS.BATTLE_BOARD_ROW_LENGTH }
      columnLength={ PARAMETERS.BATTLE_BOARD_COLUMN_LENGTH }
      additionalClassNames={ ['root__battle-board'] }
    >
      <SquareMatrix squareMatrix={ this.props.battleSquares } />
    </Board>;
  }
}

BattleBoard = connect(state => state)(BattleBoard);


module.exports = BattleBoard;
