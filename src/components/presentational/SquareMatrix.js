const React = require('react');

const { FACTION_TYPES, STYLES } = require('../../immutable/constants');
const { getIconId } = require('../../state-computers/unit');
const Square = require('./Square');


const SquareMatrix = ({ squareMatrix, cursorCoordinate, unitsOnSquares, handleTouchStartPad }) => {
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
    const icon = React.createElement('i', {
      // TODO: rpg-awesome 固定なら iconId も短縮できる
      className: ['ra', getIconId(unit), 'ra-2x'].join(' '),
    });

    return React.createElement('div', {
      key: 'square-matrix-unit-on-square-' + unit.placement.coordinate.join('-'),
      className: [
        'square-matrix__unit',
        'square-matrix__unit--unit-on-square',
        unit.factionType === FACTION_TYPES.ALLY ? 'square-matrix__unit--ally' : 'square-matrix__unit--enemy',
      ].join(' '),
      style: {
        top: STYLES.SQUARE_HEIGHT * unit.placement.coordinate[0],
        left: STYLES.SQUARE_WIDTH * unit.placement.coordinate[1],
      },
    }, icon);
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
      React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
    ).isRequired,
    unitsOnSquares: React.PropTypes.arrayOf(
      React.PropTypes.object.isRequired,
    ),
  },
  defaultProps: {
    cursorCoordinate: null,
    handleTouchStartPad: () => {},
    unitsOnSquares: [],
  },
});


module.exports = SquareMatrix;
