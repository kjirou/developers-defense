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
export type CoordinateState = number[];
