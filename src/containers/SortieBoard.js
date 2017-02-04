const React = require('react');
const { connect } = require('react-redux');

const { touchSquare } = require('../actions');
const { BOARD_TYPES, PARAMETERS } = require('../immutable/constants');
const { createNewPlacementState } = require('../state-models/placement');
const Board = require('../components/Board');
const SquareMatrix = require('../components/SquareMatrix');


class SortieBoard extends React.Component {
  render() {
    const handleTouchStartPad = (event, { coordinate }) => {
      const placement = createNewPlacementState(BOARD_TYPES.SORTIE_BOARD, coordinate);
      this.props.dispatch(touchSquare(placement));
    };

    return <Board
      rowLength={ PARAMETERS.SORTIE_BOARD_ROW_LENGTH }
      columnLength={ PARAMETERS.SORTIE_BOARD_COLUMN_LENGTH }
      additionalClassNames={ ['root__recruitment-board'] }
    >
      <SquareMatrix
        squareMatrix={ this.props.sortieBoard.squareMatrix }
        cursorCoordinate={ this.props.cursorCoordinate }
        unitsOnSquares={ this.props.unitsOnSquares }
        handleTouchStartPad={ handleTouchStartPad }
      />
    </Board>;
  }
}

SortieBoard = connect(state => {
  const cursorCoordinate =
    state.cursor.placement.boardType === BOARD_TYPES.SORTIE_BOARD ? state.cursor.placement.coordinate : null;

  const unitsOnSquares =
    state.allies.filter(ally => ally.placement.boardType === state.sortieBoard.boardType);

  return Object.assign({}, state, {
    cursorCoordinate,
    unitsOnSquares,
  });
})(SortieBoard);


module.exports = SortieBoard;
