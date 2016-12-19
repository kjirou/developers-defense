const React = require('react');

const { STYLES } = require('../../immutable/constants');
const Square = require('./Square');


const SquareMatrix = ({ squareMatrix, cursorCoordinate, handleTouchStartPad }) => {
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
      className: 'square-matrix__cursor',
      style: {
        top: STYLES.SQUARE_HEIGHT * cursorCoordinate[0],
        left: STYLES.SQUARE_WIDTH * cursorCoordinate[1],
      },
    });
  }

  const serialSquareComponents = squareMatrix.map(rowSquares => {
    return rowSquares.map(square => {
      return React.createElement(Square, {
        rowIndex: square.coordinate[0],
        columnIndex: square.coordinate[1],
        landformType: square.landformType,
      });
    });
  });

  const components = [touchpad, serialSquareComponents];
  if (cursor) components.push(cursor);

  return React.createElement('div', props, ...components);
};

Object.assign(SquareMatrix, {
  propTypes: {
    cursorCoordinate: React.PropTypes.arrayOf(React.PropTypes.number.isRequired),
    handleTouchStartPad: React.PropTypes.func,
    squareMatrix: React.PropTypes.arrayOf(
      React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
    ).isRequired,
  },
  defaultProps: {
    cursorCoordinate: null,
    handleTouchStartPad: null,
  },
});


module.exports = SquareMatrix;
