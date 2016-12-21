const React = require('react');
const { connect } = require('react-redux');

const { moveCursor } = require('../action-creators');
const { BOARD_TYPES, PARAMETERS } = require('../immutable/constants');
const Board = require('./presentational/Board');
const SquareMatrix = require('./presentational/SquareMatrix');


class AlliesBoard extends React.Component {
  render() {
    const handleTouchStartPad = (event, { coordinate }) => {
      this.props.dispatch(moveCursor(BOARD_TYPES.ALLIES_BOARD, coordinate));
    };

    return <Board
      rowLength={ PARAMETERS.ALLIES_BOARD_ROW_LENGTH }
      columnLength={ PARAMETERS.ALLIES_BOARD_COLUMN_LENGTH }
      additionalClassNames={ ['root__recruitment-board'] }
    >
      <SquareMatrix
        squareMatrix={ this.props.alliesSquareMatrix }
        cursorCoordinate={ this.props.cursorCoordinate }
        unitsOnSquares={ this.props.unitsOnSquares }
        handleTouchStartPad={ handleTouchStartPad }
      />
    </Board>;
  }
}

AlliesBoard = connect(state => {
  const cursorCoordinate =
    state.cursor.cursorBelongingType === BOARD_TYPES.ALLIES_BOARD ?  state.cursor.coordinate : null;

  const unitsOnSquares = state.allies
    .filter(ally => ally.placement && ally.placement.boardType === BOARD_TYPES.ALLIES_BOARD);

  return Object.assign({}, state, {
    cursorCoordinate,
    unitsOnSquares,
  });
})(AlliesBoard);

module.exports = AlliesBoard;
