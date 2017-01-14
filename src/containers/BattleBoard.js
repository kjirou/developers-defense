const React = require('react');
const { connect } = require('react-redux');

const { touchSquare } = require('../actions');
const { BOARD_TYPES, PARAMETERS } = require('../immutable/constants');
const { createNewPlacementState } = require('../state-models/placement');
const Board = require('../components/Board');
const SquareMatrix = require('../components/SquareMatrix');


class BattleBoard extends React.Component {
  render() {
    const handleTouchStartPad = (event, { coordinate }) => {
      const placement = Object.assign(createNewPlacementState(), {
        boardType: BOARD_TYPES.BATTLE_BOARD,
        coordinate: coordinate.slice(),
      });
      this.props.dispatch(touchSquare(placement));
    };

    return <Board
      rowLength={ PARAMETERS.BATTLE_BOARD_ROW_LENGTH }
      columnLength={ PARAMETERS.BATTLE_BOARD_COLUMN_LENGTH }
      additionalClassNames={ ['root__battle-board'] }
    >
      <SquareMatrix
        squareMatrix={ this.props.battleBoard.squareMatrix }
        cursorCoordinate={ this.props.cursorCoordinate }
        bullets={ this.props.bullets }
        units={ this.props.enemiesInBattle }
        unitsOnSquares={ this.props.unitsOnSquares }
        handleTouchStartPad={ handleTouchStartPad }
      />
    </Board>;
  }
}

BattleBoard = connect(state => {
  const cursorCoordinate =
    state.cursor.placement.boardType === BOARD_TYPES.BATTLE_BOARD ? state.cursor.placement.coordinate : null;

  const unitsOnSquares =
    state.allies.filter(ally => ally.placement.boardType === state.battleBoard.boardType);

  const enemiesInBattle = state.enemies.filter(enemy => enemy.location);

  return Object.assign({}, state, {
    cursorCoordinate,
    unitsOnSquares,
    enemiesInBattle,
  });
})(BattleBoard);


module.exports = BattleBoard;
