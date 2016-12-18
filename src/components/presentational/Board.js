const React = require('react');

const { STYLES } = require('../../immutable/constants');


const Board = ({ children, rowLength, columnLength, additionalClassNames }) => {
  const styles = {
    width: STYLES.SQUARE_WIDTH * columnLength,
    height: STYLES.SQUARE_HEIGHT * rowLength,
  };

  const classNames = ['board'].concat(additionalClassNames);

  return React.createElement('div', {
    style: styles,
    className: classNames.join(' '),
  }, children);
};

Object.assign(Board, {
  propTypes: {
    children: React.PropTypes.element.isRequired,
    rowLength: React.PropTypes.number.isRequired,
    columnLength: React.PropTypes.number.isRequired,
    additionalClassNames: React.PropTypes.arrayOf(React.PropTypes.string.isRequired),
  },
  defaultProps: {
    additionalClassNames: [],
  },
});


module.exports = Board;
