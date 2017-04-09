// @flow

import type {
  BoardType,
  FactionType,
  FriendshipType,
  LandformType,
  UnitStateChangeType,
} from '../constants';


//
// A position in a rectangle from the top/left
//
//    0 1 2
//   +-+-+-+
//  0| |a| | a = { x: 1, y: 0 }
//   +-+-+-+
//  1| | |b| b = { x: 2, y: 1 }
//   +-+-+-+
//
// Negative numbers are also allowed, since they may specify positions outside the rectangle.
//
export type LocationState = {
  x: number,
  y: number,
};

//
// A position in a SquareMatrixState from the top/left
//
//    0 1 2
//   +-+-+-+
//  0| |a| | a = { rowIndex: 0, columnIndex: 1 }
//   +-+-+-+
//  1| | |b| b = { rowIndex: 1, columnIndex: 2 }
//   +-+-+-+
//
// Negative numbers are also allowed, since they may specify positions outside the matrix.
//
export type CoordinateState = {
  rowIndex: number,
  columnIndex: number,
};

export type RectangleState = {
  top: number,
  bottom: number,
  left: number,
  right: number,
};

export type SquareState = {
  uid: string,
  coordinate: CoordinateState,
  landformType: LandformType,
};

// Each side is at least 1 or more in length.
export type SquareMatrixState = SquareState[][];

export type BoardState = {
  boardType: BoardType,
  squareMatrix: SquareMatrixState,
};

export type PlacementState = {
  boardType: BoardType,
  coordinate: CoordinateState,
};

export type UnitState = {
  uid: string,
  factionType: FactionType,
  placement: PlacementState | null,
  location: LocationState | null,
  destinations: LocationState[],
  // The index of the currently active element in destinations.
  // 0 ~ (destinations.length - 1)
  destinationIndex: number,
  // One of JOB_IDS
  jobId: string,
  // A integer >= 0
  hitPoints: number,
  // A integer >= 0
  fixedMaxHitPoints: number | null,

  /**
   * 累積している移動ポイント
   * float >= 0
   * NECESSARY_MOVE_POINTS 分の MP 消費して 1 マス移動が出来る
   * 省略名 "MP"
   */
  movePoints: number,

  /**
   * 累積可能な移動ポイントの最大値
   * integer >= 0
   * 一度に移動できる距離を示す値でもある
   * 敵の場合は一歩ごとに MP が 0 になるので、この値は参照されない
   */
  maxMovePoints: number,

  /**
   * 1 tick 毎に回復する MP
   * float
   * 敵の場合は ENEMY_MOVE_SPEED_RATE 倍になる
   */
  movePointsRecovery: number,

  // A integer >= 0
  actionPoints: number,
  // A integer >= 0
  maxActionPoints: number,
  // A integer >= 0
  actionPointsRecovery: number,
  // A integer >= 0
  actionPointsRecovery: number,
  // A integer >= 0
  attackPower: number,
  // A integer >= 0
  defensePower: number,
  // A integer >= 0
  mattackPower: number,
  // A integer >= 0
  mdefensePower: number,
};
// TODO: Give up the approach like the inheritance
//export type AllyUnitState = {
//  factionType: 'ALLY',
//} & BaseUnitState;
//export type EnemyUnitState = {
//  factionType: 'ENEMY',
//} & BaseUnitState;
//export type NeutralUnitState = {
//  factionType: 'NONE',
//} & BaseUnitState;
//export type UnitState = AllyUnitState | EnemyUnitState | NeutralUnitState;

export type UnitCollectionState = UnitState[];

export type EffectState = {
  uid: string,
  affectableFractionTypes: FactionType[],
  impactedLocation: LocationState,
  aimedUnitUid: string | null,
  // Relative coordinates indicating range of the effect
  relativeCoordinates: number[][] | null,
  animationId: string,
  damagePoints: number,
  healingPoints: number,
};

// Log of the effect occured for the unit
export type EffectLogState = {
  uid: string,
  unitUid: string,
  damagePoints: number | null,
  healingPoints: number | null,
};

// Log of the state change of units.
// However, all changes are not recorded. It is only what is displayed as a visual effect.
export type UnitStateChangeLogState = {
  uid: string,
  unitUid: string,
  // Now it is not used, because logs are truncated for each tick.
  tickId: number,
  type: UnitStateChangeType,
  // The meaning changes according to the `type`
  value: number | string | null,
};

export type BulletState = {
  uid: string,
  location: LocationState,
  fromLocation: LocationState,
  toLocation: LocationState,
  speed: number,
  effect: EffectState,
};

export type AppState = {
  allies: UnitCollectionState,
  battleBoard: BoardState,
  bullets: BulletState[],
  cursor: {
    placement: PlacementState | null,
  },
  enemies: UnitCollectionState,
  gameStatus: {
    tickId: number | null,
    isPaused: boolean,
  },
  sortieBoard: BoardState,
  unitStateChangeLogs: UnitStateChangeLogState[],
};
