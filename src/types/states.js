/* @flow */

/**
 * @typedef {Object} State~Location
 * @description A position on the battle-board
 * @property {number} y - A distance from top to bottom. In other words in CSS terms is "top".
 * @property {number} x - A distance from left to right. In other words in CSS terms is "left".
 */

export type LocationState = {
  x: number,
  y: number,
}
