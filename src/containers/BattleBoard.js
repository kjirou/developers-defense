const React = require('react');
const { connect } = require('react-redux');

const { PARAMETERS } = require('../immutable/constants');
const Board = require('../components/Board');
const SquareMatrix = require('../components/SquareMatrix');
const { mapStateToBattleBoardProps, mapDispatchToBattleBoardProps } = require('./connections');


class BattleBoard extends React.Component {
  render() {
    const squareMatrix = React.createElement(SquareMatrix, {
      squareMatrix: this.props.squareMatrix,
      cursorCoordinate: this.props.cursorCoordinate,
      bullets: this.props.bullets,
      units: this.props.enemiesInBattle,
      unitsOnSquares: this.props.unitsOnSquares,
      unitBasedAnimations: this.props.unitBasedAnimations,
      unitStateChangeLogs: this.props.unitStateChangeLogs,
      squareBasedAnimations: this.props.squareBasedAnimations,
      handleTouchStartPad: this.props.handleTouchStartPad,
    });

    return React.createElement(Board, {
      rowLength: PARAMETERS.BATTLE_BOARD_ROW_LENGTH,
      columnLength: PARAMETERS.BATTLE_BOARD_COLUMN_LENGTH,
      additionalClassNames: ['root__battle-board'],
      children: squareMatrix,
    });
  }
}

BattleBoard = connect(mapStateToBattleBoardProps, mapDispatchToBattleBoardProps)(BattleBoard);


module.exports = BattleBoard;
