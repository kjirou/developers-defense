// @flow

const React = require('react');
const { connect } = require('react-redux');

const { touchSquare } = require('../actions');
const { BOARD_TYPES, PARAMETERS } = require('../immutable/constants');
const { createNewPlacementState } = require('../state-models/placement');
const Board = require('../components/Board');
const SquareMatrix = require('../components/SquareMatrix');


class SortieBoard extends React.Component {
  render() {
    const squareMatrix = React.createElement(SquareMatrix, {
      squareMatrix: this.props.squareMatrix,
      cursorCoordinate: this.props.cursorCoordinate,
      unitsOnSquares: this.props.unitsOnSquares,
      handleTouchStartPad: this.props.handleTouchStartPad,
    });

    return React.createElement(Board, {
      rowLength: PARAMETERS.SORTIE_BOARD_ROW_LENGTH,
      columnLength: PARAMETERS.SORTIE_BOARD_COLUMN_LENGTH,
      additionalClassNames: ['root__recruitment-board'],
      children: squareMatrix,
    });
  }
}

const mapStateToProps = (state) => {
  const cursorCoordinate =
    state.cursor.placement && state.cursor.placement.boardType === BOARD_TYPES.SORTIE_BOARD ?
      state.cursor.placement.coordinate : null;

  const unitsOnSquares =
    state.allies.filter(ally => ally.placement.boardType === state.sortieBoard.boardType);

  return {
    cursorCoordinate,
    squareMatrix: state.sortieBoard.squareMatrix,
    unitsOnSquares,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleTouchStartPad: (event, { coordinate }) => {
      const placement = createNewPlacementState(BOARD_TYPES.SORTIE_BOARD, coordinate);
      dispatch(touchSquare(placement));
    },
  };
};

SortieBoard = connect(mapStateToProps, mapDispatchToProps)(SortieBoard);


module.exports = SortieBoard;
