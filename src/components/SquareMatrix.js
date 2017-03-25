// @flow

/*::
import type {
  CoordinateState,
  LocationState,
} from '../types/states';
import type { ModifiedSyntheticTouchEvent } from '../types/workaround';
import type { BulletProps } from './Bullet';
import type { SquareProps } from './Square';
import type { UnitProps } from './Unit';
 */

const React = require('react');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

const { STYLES } = require('../immutable/constants');
const { getIconId, isAlive, isAlly } = require('../state-models/unit');
const { locationToCoordinate } = require('../state-models/geometric-apis');
const { createNewLocationState } = require('../state-models/location');
const Bullet = require('./Bullet');
const Square = require('./Square');
const Unit = require('./Unit');


/*::
export type SquareMatrixCursorCoordinateProps = {
  rowIndex: number,
  columnIndex: number,
};

export type SquareMatrixSquareBasedAnimationProps = {
  classNames: string[],
  coordinates: CoordinateState[],
  duration: number,
  uid: string,
};

type Props = {
  bullets: BulletProps[],
  cursorCoordinate: SquareMatrixCursorCoordinateProps | null,
  handleTouchStartPad: (ModifiedSyntheticTouchEvent, { location: LocationState, coordinate: CoordinateState }) => void,
  serialSquares: SquareProps[],
  squareBasedAnimations: SquareMatrixSquareBasedAnimationProps[],
  units: UnitProps[],
}

type DefaultProps = {
  bullets: $PropertyType<Props, 'bullets'>,
  cursorCoordinate: $PropertyType<Props, 'cursorCoordinate'>,
  handleTouchStartPad: $PropertyType<Props, 'handleTouchStartPad'>,
  squareBasedAnimations: $PropertyType<Props, 'squareBasedAnimations'>,
  units: $PropertyType<Props, 'units'>,
};

export type SquareMatrixProps = {
  ...DefaultProps,
  serialSquares: $PropertyType<Props, 'serialSquares'>,
};
 */

const defaultProps = {
  bullets: [],
  cursorCoordinate: null,
  handleTouchStartPad: () => {},
  squareBasedAnimations: [],
  units: [],
};

class SquareMatrix extends React.Component {
  static _normalizeTouchPositions(event/*:ModifiedSyntheticTouchEvent*/) {
    const touch = event.changedTouches.item(0);
    const rect = event.target.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    const location = createNewLocationState(touchY, touchX);

    const result/*:{
      location: LocationState,
      coordinate: CoordinateState,
    }*/ = {
      location,
      coordinate: locationToCoordinate(location),
    };

    return result;
  }

  /*::
  static defaultProps: DefaultProps;

  props: Props;

  _squareBasedAnimationDomNode: HTMLElement;
   */

  componentDidUpdate() {
    // Execute square-based animations
    // TODO: Add UI tests
    this.props.squareBasedAnimations.forEach(({ uid, coordinates, duration, classNames }) => {
      const uidAttrName = 'data-uid';

      // If the DOM element remains, the animation is deemed to have been executed.
      if (this._squareBasedAnimationDomNode.querySelector(`[${ uidAttrName }="${ uid }"]`)) {
        return;
      }

      coordinates.forEach(coordinate => {
        const animation = document.createElement('div');
        animation.setAttribute(uidAttrName, uid);
        animation.style.top = `${ STYLES.SQUARE_HEIGHT * coordinate.rowIndex }px`;
        animation.style.left = `${ STYLES.SQUARE_HEIGHT * coordinate.columnIndex }px`;
        animation.classList.add(...classNames);

        this._squareBasedAnimationDomNode.appendChild(animation);
        setTimeout(() => {
          if (this._squareBasedAnimationDomNode) {
            this._squareBasedAnimationDomNode.removeChild(animation);
          }
        }, duration);
      });
    });
  }

  render() {
    const rootProps = {
      className: 'square-matrix',
    };

    const touchpad = React.createElement('div', {
      key: 'square-matrix-touchpad',
      className: 'square-matrix__touchpad',
      onTouchStart: (event) => {
        this.props.handleTouchStartPad(event, SquareMatrix._normalizeTouchPositions(event));
      },
    });

    let cursor = null;
    if (this.props.cursorCoordinate) {
      cursor = React.createElement('div', {
        key: 'square-matrix-cursor',
        className: 'square-matrix__cursor',
        style: {
          top: STYLES.SQUARE_HEIGHT * this.props.cursorCoordinate.rowIndex,
          left: STYLES.SQUARE_WIDTH * this.props.cursorCoordinate.columnIndex,
        },
      });
    }

    const bulletComponents = this.props.bullets.map(bullet => {
      const key = 'square-matrix-bullet-' + bullet.uid;
      return React.createElement(Bullet, Object.assign({}, bullet, { key }));
    });

    const squareBasedAnimationContainer = React.createElement('div', {
      key: 'square-matrix-square-based-animaion-container',
      className: 'square-matrix__square-based-animation-container',
      ref: (node) => { this._squareBasedAnimationDomNode = node },
    });

    const unitComponents = this.props.units.map(unit => {
      const key = 'square-matrix-unit-' + unit.uid;
      return React.createElement(Unit, Object.assign({}, unit, { key }));
    });

    const unitComponentsTransition = React.createElement(ReactCSSTransitionGroup, {
      key: 'react-css-transition-group-units',
      transitionName: 'react-transition-dead-unit',
      transitionEnter: false,
      transitionLeaveTimeout: 500,
    }, unitComponents);

    const serialSquareComponents = this.props.serialSquares.map(square => {
      const key = `square-matrix-square-${ square.rowIndex },${ square.columnIndex }`;
      return React.createElement(Square, Object.assign({}, square, { key }));
    });

    const components = [
      touchpad,
      ...(cursor ? [cursor] : []),
      ...bulletComponents,
      squareBasedAnimationContainer,
      unitComponentsTransition,
      serialSquareComponents,
    ];

    return React.createElement('div', rootProps, ...components);
  }
}

SquareMatrix.defaultProps = defaultProps;


module.exports = SquareMatrix;
