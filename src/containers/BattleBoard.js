const React = require('react');
const { connect } = require('react-redux');

const { touchSquare } = require('../actions');
const { BOARD_ANIMATION_EXPRESSION_TYPES, BOARD_TYPES, PARAMETERS } = require('../immutable/constants');
const { boardAnimations } = require('../immutable/board-animations');
const { isArrivedToDestination } = require('../state-models/bullet');
const { createEffectiveCoordinates } = require('../state-models/effect');
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
        squareBasedAnimations={ this.props.squareBasedAnimations }
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

  const squareBasedAnimations = state.bullets
    .filter(bullet => {
      const boardAnimation = boardAnimations[bullet.effect.boardAnimationId];

      return boardAnimation.expression.type === BOARD_ANIMATION_EXPRESSION_TYPES.SQUARE_BASED &&
        isArrivedToDestination(bullet);
    })
    .map(bullet => {
      const boardAnimation = boardAnimations[bullet.effect.boardAnimationId];

      return {
        uid: bullet.effect.uid,
        coordinates: createEffectiveCoordinates(bullet.effect),
        duration: boardAnimation.duration,
        classNames: boardAnimation.expression.classNames,
      };
    })
  ;

  const enemiesInBattle = state.enemies.filter(enemy => enemy.location);

  const unitsOnSquares =
    state.allies.filter(ally => ally.placement.boardType === state.battleBoard.boardType);

  return Object.assign({}, state, {
    cursorCoordinate,
    enemiesInBattle,
    unitsOnSquares,
    squareBasedAnimations,
  });
})(BattleBoard);


module.exports = BattleBoard;
