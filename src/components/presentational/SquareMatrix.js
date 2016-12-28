const React = require('react');

const { STYLES } = require('../../immutable/constants');
const { getIconId, isAlly } = require('../../state-models/unit');
const Square = require('./Square');
const Unit = require('./Unit');


const SquareMatrix = ({ squareMatrix, cursorCoordinate, units, unitsOnSquares, handleTouchStartPad }) => {
  const props = {
    className: 'square-matrix',
  };

  const touchpad = React.createElement('div', {
    className: 'square-matrix__touchpad',
    onTouchStart: (event) => {
      const touch = event.changedTouches.item(0);
      const rect = event.target.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;
      const coordinate = [
        Math.floor(touchY / STYLES.SQUARE_HEIGHT),
        Math.floor(touchX / STYLES.SQUARE_WIDTH),
      ];
      handleTouchStartPad(event, {
        coordinate,
        touchX,
        touchY,
      });
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

  // Do not place in the squares.
  const unitComponentsOnSquares = unitsOnSquares.map(unit => {
    return React.createElement(Unit, {
      key: 'square-matrix-unit-on-square-' + unit.placement.coordinate.join('-'),
      iconId: getIconId(unit),
      top: STYLES.SQUARE_HEIGHT * unit.placement.coordinate[0],
      left: STYLES.SQUARE_WIDTH * unit.placement.coordinate[1],
      classNames: [
        'square-matrix__unit',
        'square-matrix__unit--unit-on-square',
        isAlly(unit) ? 'unit--ally' : 'unit--enemy',
      ],
    });
  });

  const serialSquareComponents = squareMatrix.map(rowSquares => {
    return rowSquares.map(square => {
      return React.createElement(Square, {
        rowIndex: square.coordinate[0],
        columnIndex: square.coordinate[1],
        landformType: square.landformType,
      });
    });
  });

  const components = [
    touchpad,
    ...(cursor ? [cursor] : []),
    ...unitComponentsOnSquares,
    serialSquareComponents,
  ];

  return React.createElement('div', props, ...components);
};

Object.assign(SquareMatrix, {
  propTypes: {
    cursorCoordinate: React.PropTypes.arrayOf(React.PropTypes.number.isRequired),
    handleTouchStartPad: React.PropTypes.func,
    squareMatrix: React.PropTypes.arrayOf(
      React.PropTypes.arrayOf(
        React.PropTypes.object.isRequired
      ).isRequired
    ).isRequired,
    units: React.PropTypes.arrayOf(
      React.PropTypes.object.isRequired
    ),
    unitsOnSquares: React.PropTypes.arrayOf(
      React.PropTypes.object.isRequired
    ),
  },
  defaultProps: {
    cursorCoordinate: null,
    handleTouchStartPad: () => {},
    units: [],
    unitsOnSquares: [],
  },
});


module.exports = SquareMatrix;
