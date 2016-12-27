const React = require('react');
const { connect } = require('react-redux');

const { touchSquare } = require('../action-creators');
const { BOARD_TYPES, PARAMETERS } = require('../immutable/constants');
const { createNewPlacementState } = require('../state-models/placement');
const Board = require('./presentational/Board');
const SquareMatrix = require('./presentational/SquareMatrix');


class AlliesBoard extends React.Component {
  render() {
    const handleTouchStartPad = (event, { coordinate }) => {
      const placement = Object.assign(createNewPlacementState(), {
        boardType: BOARD_TYPES.ALLIES_BOARD,
        coordinate: coordinate.slice(),
      });
      this.props.dispatch(touchSquare(placement));
    };

    return <Board
      rowLength={ PARAMETERS.ALLIES_BOARD_ROW_LENGTH }
      columnLength={ PARAMETERS.ALLIES_BOARD_COLUMN_LENGTH }
      additionalClassNames={ ['root__recruitment-board'] }
    >
      <SquareMatrix
        squareMatrix={ this.props.alliesBoard.squareMatrix }
        cursorCoordinate={ this.props.cursorCoordinate }
        unitsOnSquares={ this.props.unitsOnSquares }
        handleTouchStartPad={ handleTouchStartPad }
      />
    </Board>;
  }
}

AlliesBoard = connect(state => {
  const cursorCoordinate =
    state.cursor.placement.boardType === BOARD_TYPES.ALLIES_BOARD ? state.cursor.placement.coordinate : null;

  const unitsOnSquares =
    state.allies.filter(ally => ally.placement.boardType === state.alliesBoard.boardType);

  return Object.assign({}, state, {
    cursorCoordinate,
    unitsOnSquares,
  });
})(AlliesBoard);


module.exports = AlliesBoard;
