const React = require('react');
const { connect } = require('react-redux');

const { PARAMETERS } = require('../immutable/constants');
const Board = require('./presentational/Board');
const SquareMatrix = require('./presentational/SquareMatrix');


class BattleBoard extends React.Component {
  render() {
    const handleTouchStartPad = (event, { coordinate }) => {
      // TODO
    };

    return <Board
      rowLength={ PARAMETERS.BATTLE_BOARD_ROW_LENGTH }
      columnLength={ PARAMETERS.BATTLE_BOARD_COLUMN_LENGTH }
      additionalClassNames={ ['root__battle-board'] }
    >
      <SquareMatrix squareMatrix={ this.props.battleSquareMatrix } handleTouchStartPad={ handleTouchStartPad } />
    </Board>;
  }
}

BattleBoard = connect(state => state)(BattleBoard);


module.exports = BattleBoard;
