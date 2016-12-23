const React = require('react');
const { connect } = require('react-redux');

const { touchSquare } = require('../action-creators');
const { BOARD_TYPES, PARAMETERS } = require('../immutable/constants');
const Board = require('./presentational/Board');
const SquareMatrix = require('./presentational/SquareMatrix');


class BattleBoard extends React.Component {
  render() {
    const handleTouchStartPad = (event, { coordinate }) => {
      this.props.dispatch(touchSquare(BOARD_TYPES.BATTLE_BOARD, coordinate));
    };

    return <Board
      rowLength={ PARAMETERS.BATTLE_BOARD_ROW_LENGTH }
      columnLength={ PARAMETERS.BATTLE_BOARD_COLUMN_LENGTH }
      additionalClassNames={ ['root__battle-board'] }
    >
      <SquareMatrix
        squareMatrix={ this.props.battleSquareMatrix }
        cursorCoordinate={ this.props.cursorCoordinate }
        unitsOnSquares={ this.props.unitsOnSquares }
        handleTouchStartPad={ handleTouchStartPad }
      />
    </Board>;
  }
}

BattleBoard = connect(state => {
  const cursorCoordinate =
    state.cursor.boardType === BOARD_TYPES.BATTLE_BOARD ?  state.cursor.coordinate : null;

  const unitsOnSquares = state.allies
    .filter(ally => ally.placement && ally.placement.boardType === BOARD_TYPES.BATTLE_BOARD);

  return Object.assign({}, state, {
    cursorCoordinate,
    unitsOnSquares,
  });
})(BattleBoard);


module.exports = BattleBoard;
