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
