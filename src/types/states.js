// @flow


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
  // One of the LANDFORM_TYPES
  // TODO: Change to string only
  landformType: string|null,
};

// Each side is at least 1 or more in length.
export type SquareMatrixState = Array<Array<SquareState>>;

export type BoardState = {
  // One of BOARD_TYPES
  boardType: string,
  squareMatrix: SquareMatrixState,
};

export type PlacementState = {
  // One of BOARD_TYPES
  boardType: string|null,
  coordinate: CoordinateState|null,
};

type BaseUnitState = {
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
  // 1.0=2px/1tick
  movingSpeed: number,
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
export type UnitState = BaseUnitState & {
  // One of FACTION_TYPES
  factionType: string,
};
export type AllyState = BaseUnitState & {
  factionType: string,
  //factionType: 'ALLY',  // TODO: Type definition fails
};
export type EnemyState = BaseUnitState & {
  factionType: string,
  //factionType: 'ENEMY',  // TODO: Type definition fails
};

export type EffectState = {
  uid: string,
  // Some of FACTION_TYPES
  affectableFractionTypes: string[],
  impactedLocation: LocationState,
  aimedUnitUid: string|null,
  // Relative coordinates indicating range of the effect
  relativeCoordinates: number[][]|null,
  animationId: string,
  damagePoints: number,
  healingPoints: number,
};

// Log of the effect occured for the unit
export type EffectLogState = {
  unitUid: string,
  damagePoints: number|null,
  healingPoints: number|null,
};
