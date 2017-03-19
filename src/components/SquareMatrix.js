// @flow

/*::
import type {
  BulletState,
  CoordinateState,
  LocationState,
  SquareMatrixState,
  UnitState,
  UnitStateChangeLogState,
} from '../types/states';
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
type Props = {
  bullets: BulletState[],
  cursorCoordinate: CoordinateState | null,
  handleTouchStartPad: ({ location: LocationState, coordinate: CoordinateState }) => void,
  squareBasedAnimations: {
    classNames: string[],
    coordinates: CoordinateState[],
    duration: number,
    uid: string,
  }[],
  squareMatrix: SquareMatrixState,
  unitBasedAnimations: {
    classNames: string[],
    duration: number,
    uid: string,
    unitUid: string,
  }[],
  unitStateChangeLogs: UnitStateChangeLogState[],
  units: UnitState[],
  unitsOnSquares: UnitState[],
}
 */

class SquareMatrix extends React.Component {
  /**
   * @param {SyntheticTouchEvent} event
   * @return {{location:<State~Location>, coordinate:<State~Coordinate>}}
   */
  static _normalizeTouchPositions(event) {
    const touch = event.changedTouches.item(0);
    const rect = event.target.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    const location = createNewLocationState(touchY, touchX);

    return {
      location,
      coordinate: locationToCoordinate(location),
    };
  }

  /**
   * @param {Object[]} unitBasedAnimations
   * @param {string} unitUid
   * @return {Object[]}
   */
  static _findUnitBasedAnimationsByUnitUid(unitBasedAnimations, unitUid) {
    return unitBasedAnimations.filter(unitBasedAnimation => unitBasedAnimation.unitUid == unitUid);
  }

  /*::
  static defaultProps: {
    bullets: $PropertyType<Props, 'bullets'>,
    cursorCoordinate: $PropertyType<Props, 'cursorCoordinate'>,
    handleTouchStartPad: $PropertyType<Props, 'handleTouchStartPad'>,
    squareBasedAnimations: $PropertyType<Props, 'squareBasedAnimations'>,
    unitBasedAnimations: $PropertyType<Props, 'unitBasedAnimations'>,
    unitStateChangeLogs: $PropertyType<Props, 'unitStateChangeLogs'>,
    units: $PropertyType<Props, 'units'>,
    unitsOnSquares: $PropertyType<Props, 'unitsOnSquares'>,
  };

  props: Props;

  _squareBasedAnimationDomNode: HTMLElement;
   */

  constructor(props/*:Props*/) {
    super(props);
  }

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
    const {
      bullets,
      cursorCoordinate,
      handleTouchStartPad,
      squareMatrix,
      unitBasedAnimations,
      unitStateChangeLogs,
      units,
      unitsOnSquares,
    } = this.props;

    const props = {
      className: 'square-matrix',
    };

    const touchpad = React.createElement('div', {
      key: 'square-matrix-touchpad',
      className: 'square-matrix__touchpad',
      onTouchStart: (event) => {
        handleTouchStartPad(event, SquareMatrix._normalizeTouchPositions(event));
      },
    });

    let cursor = null;
    if (cursorCoordinate) {
      cursor = React.createElement('div', {
        key: 'square-matrix-cursor',
        className: 'square-matrix__cursor',
        style: {
          top: STYLES.SQUARE_HEIGHT * cursorCoordinate.rowIndex,
          left: STYLES.SQUARE_WIDTH * cursorCoordinate.columnIndex,
        },
      });
    }

    const bulletComponents = bullets.map(bullet => {
      return React.createElement(Bullet, {
        key: 'square-matrix-bullet-' + bullet.uid,
        top: bullet.location.y,
        left: bullet.location.x,
        classNames: [
          'square-matrix__bullet',
        ],
      });
    });

    const squareBasedAnimationContainer = React.createElement('div', {
      key: 'square-matrix-square-based-animaion-container',
      className: 'square-matrix__square-based-animation-container',
      ref: (node) => { this._squareBasedAnimationDomNode = node },
    });

    const unitComponents = units.map(unit => {
      if (!unit.location) {
        throw new Error('The unit always has `location`');
      }

      // TODO: unit.location があるはずなのを flow 上で保障できなかった
      let top = 0;
      let left = 0;
      if (unit.location) {
        top = unit.location.x;
        left = unit.location.y;
      }

      return React.createElement(Unit, {
        key: 'square-matrix-unit-' + unit.uid,
        iconId: getIconId(unit),
        top,
        left,
        classNames: [
          isAlly(unit) ? 'unit--ally' : 'unit--enemy',
          'square-matrix__unit',
          ...(isAlive(unit) ? ['square-matrix__unit--is-alive'] : []),
        ],
        animations: SquareMatrix._findUnitBasedAnimationsByUnitUid(unitBasedAnimations, unit.uid),
        stateChanges: unitStateChangeLogs.filter(v => v.unitUid === unit.uid),
      });
    });

    const unitComponentsTransition = React.createElement(ReactCSSTransitionGroup, {
      key: 'react-css-transition-group-units',
      transitionName: 'react-transition-dead-unit',
      transitionEnter: false,
      transitionLeaveTimeout: 500,
    }, unitComponents);

    // TODO: unitComponents と同じルーチンで作れるようにする
    const unitComponentsOnSquares = unitsOnSquares.map(unit => {
      if (!unit.placement) {
        throw new Error('The unit always has `placement`');
      }

      // TODO: unit.placement があるはずなのを flow 上で保障できなかった
      let top = 0;
      let left = 0;
      if (unit.placement) {
        top = STYLES.SQUARE_HEIGHT * unit.placement.coordinate.rowIndex;
        left = STYLES.SQUARE_WIDTH * unit.placement.coordinate.columnIndex;
      }

      return React.createElement(Unit, {
        key: 'square-matrix-unit-on-square-' + unit.uid,
        iconId: getIconId(unit),
        top,
        left,
        classNames: [
          isAlly(unit) ? 'unit--ally' : 'unit--enemy',
          'square-matrix__unit-on-square',
        ],
      });
    });

    const serialSquareComponents = squareMatrix.map(rowSquares => {
      return rowSquares.map(square => {
        return React.createElement(Square, {
          key: 'square-matrix-square-' + square.uid,
          rowIndex: square.coordinate.rowIndex,
          columnIndex: square.coordinate.columnIndex,
          landformType: square.landformType,
        });
      });
    });

    const components = [
      touchpad,
      ...(cursor ? [cursor] : []),
      ...bulletComponents,
      squareBasedAnimationContainer,
      unitComponentsTransition,
      ...unitComponentsOnSquares,
      serialSquareComponents,
    ];

    return React.createElement('div', props, ...components);
  }
}

SquareMatrix.defaultProps = {
  bullets: [],
  cursorCoordinate: null,
  handleTouchStartPad: () => {},
  squareBasedAnimations: [],
  unitBasedAnimations: [],
  unitStateChangeLogs: [],
  units: [],
  unitsOnSquares: [],
};


module.exports = SquareMatrix;
