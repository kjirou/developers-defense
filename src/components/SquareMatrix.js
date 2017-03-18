const React = require('react');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

const { STYLES } = require('../immutable/constants');
const { getIconId, isAlive, isAlly } = require('../state-models/unit');
const { locationToCoordinate } = require('../state-models/geometric-apis');
const { createNewLocationState } = require('../state-models/location');
const Bullet = require('./Bullet');
const Square = require('./Square');
const Unit = require('./Unit');


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

  constructor(...args) {
    super(...args);

    this._squareBasedAnimationDomNode = null;
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
        animation.style.top = `${ STYLES.SQUARE_HEIGHT * coordinate[0] }px`;
        animation.style.left = `${ STYLES.SQUARE_HEIGHT * coordinate[1] }px`;
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
          top: STYLES.SQUARE_HEIGHT * cursorCoordinate[0],
          left: STYLES.SQUARE_WIDTH * cursorCoordinate[1],
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
      return React.createElement(Unit, {
        key: 'square-matrix-unit-' + unit.uid,
        iconId: getIconId(unit),
        top: unit.location.y,
        left: unit.location.x,
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

    // Do not place in the squares.
    const unitComponentsOnSquares = unitsOnSquares.map(unit => {
      return React.createElement(Unit, {
        key: 'square-matrix-unit-on-square-' + unit.uid,
        iconId: getIconId(unit),
        top: STYLES.SQUARE_HEIGHT * unit.placement.coordinate[0],
        left: STYLES.SQUARE_WIDTH * unit.placement.coordinate[1],
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
          rowIndex: square.coordinate[0],
          columnIndex: square.coordinate[1],
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


const coordinatePropType = React.PropTypes.arrayOf(React.PropTypes.number.isRequired);

Object.assign(SquareMatrix, {
  propTypes: {
    bullets: React.PropTypes.arrayOf(
      React.PropTypes.object.isRequired
    ),
    cursorCoordinate: coordinatePropType,
    handleTouchStartPad: React.PropTypes.func,
    squareMatrix: React.PropTypes.arrayOf(
      React.PropTypes.arrayOf(
        React.PropTypes.object.isRequired
      ).isRequired
    ).isRequired,
    unitBasedAnimations: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        classNames: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired,
        duration: React.PropTypes.number.isRequired,
        uid: React.PropTypes.string.isRequired,
        unitUid: React.PropTypes.string.isRequired,
      }).isRequired
    ),
    unitStateChangeLogs: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        uid: React.PropTypes.string.isRequired,
        unitUid: React.PropTypes.string.isRequired,
        tickId: React.PropTypes.number.isRequired,
        type: React.PropTypes.string.isRequired,
        value: React.PropTypes.any.isRequired,
      }).isRequired
    ),
    units: React.PropTypes.arrayOf(
      React.PropTypes.object.isRequired
    ),
    unitsOnSquares: React.PropTypes.arrayOf(
      React.PropTypes.object.isRequired
    ),
    squareBasedAnimations: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        classNames: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired,
        coordinates: React.PropTypes.arrayOf(coordinatePropType.isRequired).isRequired,
        duration: React.PropTypes.number.isRequired,
        uid: React.PropTypes.string.isRequired,
      }).isRequired
    ),
  },
  defaultProps: {
    bullets: [],
    cursorCoordinate: null,
    handleTouchStartPad: () => {},
    unitBasedAnimations: [],
    unitStateChangeLogs: [],
    units: [],
    unitsOnSquares: [],
    squareBasedAnimations: [],
  },
});


module.exports = SquareMatrix;
