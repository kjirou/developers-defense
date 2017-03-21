// @flow

/**
 * `mapStateToProps` and `mapDispatchToProps` definitions for each container
 *
 * TODO: ここに別ファイルとして定義している理由は、container 対して Flow を適用できなかったからである。
 */


/*::
import type { Dispatch } from 'redux';

import type { AppState } from '../types/states';
 */

const { touchSquare } = require('../actions');
const { animations } = require('../immutable/animations');
const { ANIMATION_DESTINATION_TYPES, BOARD_TYPES, PARAMETERS } = require('../immutable/constants');
const { isArrivedToDestination } = require('../state-models/bullet');
const { createEffectiveCoordinates } = require('../state-models/effect');
const { createNewPlacementState } = require('../state-models/placement');
const { getEndPointCoordinate } = require('../state-models/square-matrix');


const mapStateToBattleBoardProps = (state/*:AppState*/) => {
  const cursorCoordinate =
    state.cursor.placement && state.cursor.placement.boardType === BOARD_TYPES.BATTLE_BOARD ?
      state.cursor.placement.coordinate : null;

  const enemiesInBattle = state.enemies.filter(enemy => enemy.location);

  const alliesInBattle =
    state.allies.filter(ally => ally.placement && ally.placement.boardType === state.battleBoard.boardType);

  const units = enemiesInBattle.concat(alliesInBattle);

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
    unitBasedAnimations,
    unitStateChangeLogs: state.unitStateChangeLogs,
    squareBasedAnimations,
    squareMatrix: state.battleBoard.squareMatrix,
    units,
  };
};

const mapDispatchToBattleBoardProps = (dispatch/*:Dispatch<Function>*/, ownProps/*:Object*/) => {
  return {
    handleTouchStartPad: (event/*:Object*/, { coordinate }/*:Object*/) => {
      const placement = createNewPlacementState(BOARD_TYPES.BATTLE_BOARD, coordinate);
      dispatch(touchSquare(placement));
    },
  };
};

const mapStateToSortieBoardProps = (state/*:AppState*/) => {
  const cursorCoordinate =
    state.cursor.placement && state.cursor.placement.boardType === BOARD_TYPES.SORTIE_BOARD ?
      state.cursor.placement.coordinate : null;

  const units =
    state.allies.filter(ally => ally.placement && ally.placement.boardType === state.sortieBoard.boardType);

  return {
    cursorCoordinate,
    squareMatrix: state.sortieBoard.squareMatrix,
    units,
  };
};

const mapDispatchToSortieBoardProps = (dispatch/*:Dispatch<Function>*/, ownProps/*:Object*/) => {
  return {
    handleTouchStartPad: (event/*:Object*/, { coordinate }/*:Object*/) => {
      const placement = createNewPlacementState(BOARD_TYPES.SORTIE_BOARD, coordinate);
      dispatch(touchSquare(placement));
    },
  };
};


module.exports = {
  mapStateToBattleBoardProps,
  mapDispatchToBattleBoardProps,
  mapStateToSortieBoardProps,
  mapDispatchToSortieBoardProps
};
