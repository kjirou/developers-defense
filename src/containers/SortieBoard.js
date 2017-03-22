const React = require('react');
const { connect } = require('react-redux');

const { PARAMETERS } = require('../immutable/constants');
const Board = require('../components/Board');
const SquareMatrix = require('../components/SquareMatrix');
const { mapStateToSortieBoardProps, mapDispatchToSortieBoardProps } = require('./connections');


class SortieBoard extends React.Component {
  render() {
    const squareMatrix = React.createElement(SquareMatrix, {
      cursorCoordinate: this.props.cursorCoordinate,
      handleTouchStartPad: this.props.handleTouchStartPad,
      serialSquares: this.props.serialSquares,
      units: this.props.units,
    });

    return React.createElement(Board, {
      rowLength: PARAMETERS.SORTIE_BOARD_ROW_LENGTH,
      columnLength: PARAMETERS.SORTIE_BOARD_COLUMN_LENGTH,
      additionalClassNames: ['root__recruitment-board'],
      children: squareMatrix,
    });
  }
}

SortieBoard = connect(mapStateToSortieBoardProps, mapDispatchToSortieBoardProps)(SortieBoard);


module.exports = SortieBoard;
