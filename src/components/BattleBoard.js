const React = require('react');
const { connect } = require('react-redux');

const { moveCursor } = require('../action-creators');
const { CURSOR_BELONGING_TYPES, PARAMETERS } = require('../immutable/constants');
const Board = require('./presentational/Board');
const SquareMatrix = require('./presentational/SquareMatrix');


class BattleBoard extends React.Component {
  render() {
    const handleTouchStartPad = (event, { coordinate }) => {
      this.props.dispatch(moveCursor(CURSOR_BELONGING_TYPES.BATTLE_BOARD, coordinate));
    };

    return <Board
      rowLength={ PARAMETERS.BATTLE_BOARD_ROW_LENGTH }
      columnLength={ PARAMETERS.BATTLE_BOARD_COLUMN_LENGTH }
      additionalClassNames={ ['root__battle-board'] }
    >
      <SquareMatrix
        squareMatrix={ this.props.battleSquareMatrix }
        cursorCoordinate={ this.props.cursorCoordinate }
        handleTouchStartPad={ handleTouchStartPad }
      />
    </Board>;
  }
}

BattleBoard = connect(state => {
  const cursorCoordinate =
    state.cursor.cursorBelongingType === CURSOR_BELONGING_TYPES.BATTLE_BOARD ?  state.cursor.coordinate : null;

  return Object.assign({}, state, {
    cursorCoordinate,
  });
})(BattleBoard);


module.exports = BattleBoard;
