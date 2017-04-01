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
import type { SquareViewerProps } from '../components/SquareViewer';
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

const actions = require('../actions');
const { animations } = require('../immutable/animations');
const {
  ANIMATION_DESTINATION_TYPES,
  BOARD_TYPES,
  FACTION_TYPES,
  GAME_PROGRESS_TYPES,
  LANDFORM_TYPES,
  PARAMETERS,
  STYLES,
} = require('../immutable/constants');
const bulletMethods = require('../state-models/bullet');
const effectMethods = require('../state-models/effect');
const placementMethods = require('../state-models/placement');
const squareMatrixMethods = require('../state-models/square-matrix');
const unitCollectionMethods = require('../state-models/unit-collection');
const unitMethods = require('../state-models/unit');


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
    animations,
    classNames: [
      unit.factionType === FACTION_TYPES.ALLY ? 'unit--ally' : 'unit--enemy',
      'square-matrix__unit',
      ...(unitMethods.isAlive(unit) ? ['square-matrix__unit--is-alive'] : []),
      ...additionalClassNames,
    ],
    iconId: unitMethods.getIconId(unit),
    hitPointsRate: unitMethods.getHitPointsRate(unit),
    left,
    stateChanges,
    top,
    uid: unit.uid,
  };
};

const createSerialSquarePropsList = (squareMatrix/*:SquareMatrixState*/)/*:SquareProps[]*/ => {
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
        bulletMethods.isArrivedToDestination(bullet);
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
        bulletMethods.isArrivedToDestination(bullet);
    })
    .map(bullet => {
      const animation = animations[bullet.effect.animationId];

      return {
        uid: bullet.effect.uid,
        coordinates: effectMethods.createEffectiveCoordinates(
          bullet.effect,
          squareMatrixMethods.getEndPointCoordinate(state.battleBoard.squareMatrix)
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
    serialSquares: createSerialSquarePropsList(state.battleBoard.squareMatrix),
    squareBasedAnimations,
    units,
    handleTouchStartPad: (event, { coordinate }) => {
      const placement = placementMethods.createNewPlacementState(BOARD_TYPES.BATTLE_BOARD, coordinate);
      dispatch(actions.touchSquare(placement));
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
    serialSquares: createSerialSquarePropsList(state.sortieBoard.squareMatrix),
    units,
    handleTouchStartPad: (event, { coordinate }) => {
      const placement = placementMethods.createNewPlacementState(BOARD_TYPES.SORTIE_BOARD, coordinate);
      dispatch(actions.touchSquare(placement));
    },
  };
};

const createStatusBarProps = (state/*:AppState*/)/*:StatusBarProps*/ => {
  return {
    gameTime: state.gameStatus.tickId === null ?
      0 : Math.floor(state.gameStatus.tickId / PARAMETERS.TICKS_PER_SECOND),
  };
};

const createSquareViewerProps = (state/*:AppState*/)/*:SquareViewerProps*/ => {
  let selectedAlly = null;
  let selectedBoard = null;
  let selectedSquare = null;

  // TODO: A workaround for Flow error of "Property not found in possibly null value"
  const placement = state.cursor.placement;

  if (placement) {
    selectedAlly = unitCollectionMethods.findUnitByPlacement(state.allies, placement);

    selectedBoard = placement.boardType === BOARD_TYPES.BATTLE_BOARD
      ? state.battleBoard
      : state.sortieBoard;

    selectedSquare = squareMatrixMethods.findSquareByCoordinate(
      selectedBoard.squareMatrix,
      placement.coordinate
    );
  }

  let unit = null;
  if (selectedAlly) {
    unit = Object.assign({}, createUnitProps(selectedAlly, [], []), {
      // TODO: 正しい位置を上書きして最左上になるようにしているが雑
      top: 0,
      left: 0,
    });
  }

  return {
    unit,
    landformType: selectedSquare ? selectedSquare.landformType : LANDFORM_TYPES.NONE,
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
      dispatch(actions.extendGameStatus({ isPaused: true }));
    },
    handleResumeGameButtonTouchStart: () => {
      dispatch(actions.extendGameStatus({ isPaused: false }));
    },
    handleStartGameButtonTouchStart: () => {
      dispatch(actions.startGame());
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
    squareViewer: createSquareViewerProps(state),
    statusBar: createStatusBarProps(state),
  };
};


module.exports = {
  _createSerialSquarePropsList: createSerialSquarePropsList,
  createRootProps,
};
