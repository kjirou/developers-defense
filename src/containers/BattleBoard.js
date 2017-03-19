const React = require('react');
const { connect } = require('react-redux');

const { touchSquare } = require('../actions');
const { ANIMATION_DESTINATION_TYPES, BOARD_TYPES, PARAMETERS } = require('../immutable/constants');
const { animations } = require('../immutable/animations');
const { isArrivedToDestination } = require('../state-models/bullet');
const { createEffectiveCoordinates } = require('../state-models/effect');
const { createNewPlacementState } = require('../state-models/placement');
const { getEndPointCoordinate } = require('../state-models/square-matrix');
const Board = require('../components/Board');
const SquareMatrix = require('../components/SquareMatrix');


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

const mapStateToProps = (state) => {
  const cursorCoordinate =
    state.cursor.placement && state.cursor.placement.boardType === BOARD_TYPES.BATTLE_BOARD ?
      state.cursor.placement.coordinate : null;

  const enemiesInBattle = state.enemies.filter(enemy => enemy.location);

  const unitsOnSquares =
    state.allies.filter(ally => ally.placement.boardType === state.battleBoard.boardType);

  const unitBasedAnimations = state.bullets
    .filter(bullet => {
      return bullet.effect.animationDestinationType === ANIMATION_DESTINATION_TYPES.UNIT &&
        isArrivedToDestination(bullet);
    })
    .map(bullet => {
      const animation = animations[bullet.effect.animationId];

      return {
        uid: bullet.effect.uid,
        unitUid: bullet.effect.aimedUnitUid,
        duration: animation.duration,
        classNames: animation.getExpressionClassNames(),
      };
    })
  ;

  const squareBasedAnimations = state.bullets
    .filter(bullet => {
      return bullet.effect.animationDestinationType === ANIMATION_DESTINATION_TYPES.SQUARE &&
        isArrivedToDestination(bullet);
    })
    .map(bullet => {
      const animation = animations[bullet.effect.animationId];

      return {
        uid: bullet.effect.uid,
        coordinates: createEffectiveCoordinates(
          bullet.effect,
          getEndPointCoordinate(state.battleBoard.squareMatrix)
        ),
        duration: animation.duration,
        classNames: animation.getExpressionClassNames(),
      };
    })
  ;

  return {
    bullets: state.bullets,
    cursorCoordinate,
    enemiesInBattle,
    unitsOnSquares,
    unitBasedAnimations,
    unitStateChangeLogs: state.unitStateChangeLogs,
    squareBasedAnimations,
    squareMatrix: state.battleBoard.squareMatrix,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleTouchStartPad: (event, { coordinate }) => {
      const placement = createNewPlacementState(BOARD_TYPES.BATTLE_BOARD, coordinate);
      dispatch(touchSquare(placement));
    },
  };
};

BattleBoard = connect(mapStateToProps, mapDispatchToProps)(BattleBoard);


module.exports = BattleBoard;
