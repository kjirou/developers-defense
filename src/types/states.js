// @flow

import type {
  BoardType,
  FactionType,
  FriendshipType,
  LandformType,
  UnitStateChangeType,
} from '../immutable/constants';


// A position on the battle-board
export type LocationState = {
  // A distance from top to bottom. In other words in CSS terms is "top".
  x: number,
  // A distance from left to right. In other words in CSS terms is "left".
  y: number,
}

// The position of a square-matrix.
// For example, it means [rowIndex, columnIndex] or [m, n].
// TODO: Change to { rowIndex, columnIndex }
export type CoordinateState = number[];

export type RectangleState = {
  top: number,
  bottom: number,
  left: number,
  right: number,
};

export type SquareState = {
  uid: string,
  coordinate: CoordinateState,
  // TODO: Change to string only
  landformType: LandformType | null,
};

// Each side is at least 1 or more in length.
export type SquareMatrixState = SquareState[][];

export type BoardState = {
  boardType: BoardType,
  squareMatrix: SquareMatrixState,
};

export type PlacementState = {
  boardType: BoardType | null,
  coordinate: CoordinateState | null,
};

export type UnitState = {
  uid: string,
  factionType: FactionType,
  placement: PlacementState,
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
  // 1 = Increase 1MP/1tick
  movingSpeed: number,
  // Abbreviated name is "MP".
  // 1 square can be moved by consuming 100 MP
  movePoints: number,
  // A integer >= 0
  actionPoints: number,
  // A integer >= 0
  actionPointsRecovery: number,
  // A integer >= 0
  maxActionPoints: number,
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
