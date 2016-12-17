const React = require('react');

const Square = require('./Square');


const SquareMatrix = ({ squareMatrix }) => {
  const serialSquareComponents = squareMatrix.map(rowSquares => {
    return rowSquares.map(square => {
      return React.createElement(Square, {
        rowIndex: square.coordinate[0],
        columnIndex: square.coordinate[1],
        landformType: square.landformType,
      });
    });
  });
  return React.createElement('div', { className: 'square-matrix' }, serialSquareComponents);
};

Object.assign(SquareMatrix, {
  propTypes: {
    squareMatrix: React.PropTypes.arrayOf(
      React.PropTypes.arrayOf(React.PropTypes.object.isRequired).isRequired,
    ).isRequired,
  },
});


module.exports = SquareMatrix;
