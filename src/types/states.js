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

export type PlacementState = {
  // One of BOARD_TYPES
  boardType: string|null,
  coordinate: CoordinateState|null,
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
