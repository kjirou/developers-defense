// @flow

/*::
import type { RectangleState } from '../types/states';
 */


const createNewRectangleState = (
  params/*:{
    top?: number,
    bottom?: number,
    left?: number,
    right?: number,
    x?: number,
    y?: number,
    width?: number,
    height?: number,
  }*/
)/*:RectangleState*/ => {
  let top;
  let bottom;
  let left;
  let right;

  if (
    ['top', 'bottom', 'left', 'right'].every(k => params[k] !== undefined) &&
    ['x', 'y', 'width', 'height'].every(k => params[k] === undefined)
  ) {
    top = params.top;
    bottom = params.bottom;
    left = params.left;
    right = params.right;
  } else if (
    ['top', 'bottom', 'left', 'right'].every(k => params[k] === undefined) &&
    ['x', 'y', 'width', 'height'].every(k => params[k] !== undefined)
  ) {
    top = params.y;
    bottom = params.y + params.height;
    left = params.x;
    right = params.x + params.width;
  }

  if (top === undefined || bottom === undefined || left === undefined || right === undefined) {
    throw new Error('`{top, bottom, right, left}` and `{x, y, width, height}` are mixed');
  }

  if (bottom < top) {
    throw new Error(`bottom is less than top`);
  } else if (right < left) {
    throw new Error(`right is less than left`);
  }

  return {
    top,
    bottom,
    left,
    right,
  };
};

/*::
type XYWidthHeight = {
  x: number,
  y: number,
  width: number,
  height: number,
};
 */
const toXYWidthHeight = (rectangle/*:RectangleState*/)/*:XYWidthHeight*/ => {
  return {
    x: rectangle.left,
    y: rectangle.top,
    width: rectangle.right - rectangle.left,
    height: rectangle.bottom - rectangle.top,
  };
};


module.exports = {
  createNewRectangleState,
  toXYWidthHeight,
};
