// @flow

/**
 * `mapStateToProps` and `mapDispatchToProps` definitions for each container
 *
 * TODO: ここに別ファイルとして定義している理由は、container 対して Flow を適用できなかったからである。
 */


/*::
import type { Dispatch } from 'redux';

import type { SquareProps } from '../components/Square';
import type { UnitAnimationProps, UnitProps } from '../components/Unit';
import type {
  AppState,
  SquareMatrixState,
  UnitState,
  UnitStateChangeLogState,
} from '../types/states';
 */

const { touchSquare } = require('../actions');
const { animations } = require('../immutable/animations');
const { ANIMATION_DESTINATION_TYPES, BOARD_TYPES, PARAMETERS, STYLES } = require('../immutable/constants');
const { isArrivedToDestination } = require('../state-models/bullet');
const { createEffectiveCoordinates } = require('../state-models/effect');
const { createNewPlacementState } = require('../state-models/placement');
const { getEndPointCoordinate } = require('../state-models/square-matrix');
const { getIconId, isAlive, isAlly } = require('../state-models/unit');


const createUnitProps = (
  unit/*:UnitState*/,
  animations/*:UnitAnimationProps[]*/,
  unitStateChangeLogs/*:UnitStateChangeLogState[]*/
)/*:UnitProps*/ => {
  let top = 0;
  let left = 0;
  const additionalClassNames = [];

  if (unit.location) {
    top = unit.location.y;
    left = unit.location.x;
    additionalClassNames.push('square-matrix__unit--layer-two');
  } else if (unit.placement) {
    top = STYLES.SQUARE_HEIGHT * unit.placement.coordinate.rowIndex;
    left = STYLES.SQUARE_WIDTH * unit.placement.coordinate.columnIndex;
    additionalClassNames.push('square-matrix__unit--layer-one');
  } else {
    throw new Error('The unit always has `location` or `placement`');
  }

  const stateChanges = unitStateChangeLogs
    .filter(v => v.unitUid === unit.uid)
    .map(v => {
      return {
        uid: v.uid,
        type: v.type,
        value: v.value,
      };
    })
  ;

  return {
    iconId: getIconId(unit),
    top,
    left,
    classNames: [
      isAlly(unit) ? 'unit--ally' : 'unit--enemy',
      'square-matrix__unit',
      ...(isAlive(unit) ? ['square-matrix__unit--is-alive'] : []),
      ...additionalClassNames,
    ],
    animations,
    stateChanges,
    uid: unit.uid,
  };
};

const squareMatrixToSerialSquares = (squareMatrix/*:SquareMatrixState*/)/*:SquareProps[]*/ => {
  const serialSquares = [];

  squareMatrix.forEach(rowSquares => {
    rowSquares.forEach(square => {
      serialSquares.push({
        rowIndex: square.coordinate.rowIndex,
        columnIndex: square.coordinate.columnIndex,
        landformType: square.landformType,
      });
    });
  });

  return serialSquares;
};

const mapStateToBattleBoardProps = (state/*:AppState*/) => {
  const cursorCoordinate =
    state.cursor.placement && state.cursor.placement.boardType === BOARD_TYPES.BATTLE_BOARD ?
      state.cursor.placement.coordinate : null;

  const unitBasedAnimations = state.bullets
    .filter(bullet => {
      return bullet.effect.animationDestinationType === ANIMATION_DESTINATION_TYPES.UNIT &&
        isArrivedToDestination(bullet);
    })
    .map(bullet => {
      const animation = animations[bullet.effect.animationId];

      return {
        unitUid: bullet.effect.aimedUnitUid,
        animation: {
          classNames: animation.getExpressionClassNames(),
          duration: animation.duration,
          uid: bullet.effect.uid,
        },
      };
    })
  ;

  const units = [
    ...state.enemies.filter(enemy => enemy.location),
    ...state.allies.filter(ally => ally.placement && ally.placement.boardType === BOARD_TYPES.BATTLE_BOARD),
  ].map(unitState => {
    const animations = unitBasedAnimations
      .filter(unitBasedAnimation => unitBasedAnimation.unitUid === unitState.uid)
      .map(unitBasedAnimation => unitBasedAnimation.animation);
    ;
    return createUnitProps(unitState, animations, state.unitStateChangeLogs);
  });

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
    serialSquares: squareMatrixToSerialSquares(state.battleBoard.squareMatrix),
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

  const units = state.allies
    .filter(ally => ally.placement && ally.placement.boardType === BOARD_TYPES.SORTIE_BOARD)
    .map(unitState => createUnitProps(unitState, [], []))
  ;

  return {
    cursorCoordinate,
    serialSquares: squareMatrixToSerialSquares(state.sortieBoard.squareMatrix),
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
  _squareMatrixToSerialSquares: squareMatrixToSerialSquares,
  mapStateToBattleBoardProps,
  mapDispatchToBattleBoardProps,
  mapStateToSortieBoardProps,
  mapDispatchToSortieBoardProps
};
