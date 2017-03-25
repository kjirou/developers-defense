// @flow

/**
 * Map Redux's state to React's props
 */


/*::
import type { Dispatch } from 'redux';

import type { Action } from '../actions';
import type { BoardProps } from '../components/Board';
import type { BulletProps } from '../components/Bullet';
import type { DebugButtonsProps } from '../components/DebugButtons';
import type { RootProps } from '../components/Root';
import type { SquareProps } from '../components/Square';
import type { StatusBarProps } from '../components/StatusBar';
import type {
  SquareMatrixCursorCoordinateProps,
  SquareMatrixSquareBasedAnimationProps,
  SquareMatrixProps,
} from '../components/SquareMatrix';
import type { UnitAnimationProps, UnitProps } from '../components/Unit';
import type { GameProgressType } from '../immutable/constants';
import type {
  AppState,
  BulletState,
  SquareMatrixState,
  UnitState,
  UnitStateChangeLogState,
  PlacementState,
} from '../types/states';
 */

const {
  extendGameStatus,
  startGame,
  touchSquare,
} = require('../actions');
const { animations } = require('../immutable/animations');
const {
  ANIMATION_DESTINATION_TYPES,
  BOARD_TYPES,
  GAME_PROGRESS_TYPES,
  PARAMETERS,
  STYLES,
} = require('../immutable/constants');
const { isArrivedToDestination } = require('../state-models/bullet');
const { createEffectiveCoordinates } = require('../state-models/effect');
const { createNewPlacementState } = require('../state-models/placement');
const { getEndPointCoordinate } = require('../state-models/square-matrix');
const { getIconId, isAlive, isAlly } = require('../state-models/unit');


const createSquareMatrixCursorCoordinateProps = (
  placement/*:PlacementState*/
)/*:SquareMatrixCursorCoordinateProps*/ => {
  return {
    rowIndex: placement.coordinate.rowIndex,
    columnIndex: placement.coordinate.columnIndex,
  };
};

const createBulletProps = (bullet/*:BulletState*/)/*:BulletProps*/ => {
  return {
    uid: bullet.uid,
    top: bullet.location.y,
    left: bullet.location.x,
    classNames: [
      'square-matrix__bullet',
    ],
  };
};

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

const createSerialSquares = (squareMatrix/*:SquareMatrixState*/)/*:SquareProps[]*/ => {
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

const createBattleBoardProps = ()/*:BoardProps*/ => {
  return {
    rowLength: PARAMETERS.BATTLE_BOARD_ROW_LENGTH,
    columnLength: PARAMETERS.BATTLE_BOARD_COLUMN_LENGTH,
    additionalClassNames: ['root__battle-board'],
  };
};

const createBattleBoardSquareMatrixProps = (
  state/*:AppState*/, dispatch/*:Dispatch<Action>*/
)/*:SquareMatrixProps*/ => {
  const cursorCoordinate = (
    state.cursor.placement &&
    state.cursor.placement.boardType === BOARD_TYPES.BATTLE_BOARD
  ) ? createSquareMatrixCursorCoordinateProps(state.cursor.placement) : null;

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

  const squareBasedAnimations/*:SquareMatrixSquareBasedAnimationProps[]*/ = state.bullets
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

  return {
    bullets: state.bullets.map(createBulletProps),
    cursorCoordinate,
    serialSquares: createSerialSquares(state.battleBoard.squareMatrix),
    squareBasedAnimations,
    units,
    handleTouchStartPad: (event, { coordinate }) => {
      const placement = createNewPlacementState(BOARD_TYPES.BATTLE_BOARD, coordinate);
      dispatch(touchSquare(placement));
    },
  };
};

const createSortieBoardProps = ()/*:BoardProps*/ => {
  return {
    rowLength: PARAMETERS.SORTIE_BOARD_ROW_LENGTH,
    columnLength: PARAMETERS.SORTIE_BOARD_COLUMN_LENGTH,
    additionalClassNames: ['root__recruitment-board'],
  };
};

const createSortieBoardSquareMatrixProps = (
  state/*:AppState*/, dispatch/*:Dispatch<Action>*/
)/*:SquareMatrixProps*/ => {
  const cursorCoordinate = (
    state.cursor.placement &&
    state.cursor.placement.boardType === BOARD_TYPES.SORTIE_BOARD
  ) ? createSquareMatrixCursorCoordinateProps(state.cursor.placement) : null;

  const units = state.allies
    .filter(ally => ally.placement && ally.placement.boardType === BOARD_TYPES.SORTIE_BOARD)
    .map(unitState => createUnitProps(unitState, [], []))
  ;

  return {
    cursorCoordinate,
    serialSquares: createSerialSquares(state.sortieBoard.squareMatrix),
    units,
    handleTouchStartPad: (event, { coordinate }) => {
      const placement = createNewPlacementState(BOARD_TYPES.SORTIE_BOARD, coordinate);
      dispatch(touchSquare(placement));
    },
  };
};

const createStatusBarProps = (state/*:AppState*/)/*:StatusBarProps*/ => {
  return {
    gameTime: state.gameStatus.tickId === null ?
      0 : Math.floor(state.gameStatus.tickId / PARAMETERS.TICKS_PER_SECOND),
  };
};

const createDebugButtonsProps = (state/*:AppState*/, dispatch/*:Dispatch<Action>*/)/*:DebugButtonsProps*/ => {
  let gameProgressType;
  if (state.gameStatus.tickId === null) {
    gameProgressType = GAME_PROGRESS_TYPES.NOT_STARTED;
  } else {
    gameProgressType = state.gameStatus.isPaused ? GAME_PROGRESS_TYPES.PAUSED : GAME_PROGRESS_TYPES.STARTED;
  }

  return {
    gameProgressType,
    handlePauseGameButtonTouchStart: () => {
      dispatch(extendGameStatus({ isPaused: true }));
    },
    handleResumeGameButtonTouchStart: () => {
      dispatch(extendGameStatus({ isPaused: false }));
    },
    handleStartGameButtonTouchStart: () => {
      dispatch(startGame());
    },
  };
};

const createRootProps = (state/*:AppState*/, dispatch/*:Dispatch<Action>*/)/*:RootProps*/ => {
  return {
    battleBoard: createBattleBoardProps(),
    battleBoardSquareMatrix: createBattleBoardSquareMatrixProps(state, dispatch),
    debugButtons: createDebugButtonsProps(state, dispatch),
    sortieBoard: createSortieBoardProps(),
    sortieBoardSquareMatrix: createSortieBoardSquareMatrixProps(state, dispatch),
    statusBar: createStatusBarProps(state),
  };
};


module.exports = {
  _createSerialSquares: createSerialSquares,
  createRootProps,
};
