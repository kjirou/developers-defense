const React = require('react');

const { STYLES } = require('../../consts');
const Square = require('./Square');


class Board extends React.Component {
  _calculateWidth() {
    return STYLES.SQUARE_WIDTH * this.props.columnLength;
  }

  _calculateHeight() {
    return STYLES.SQUARE_HEIGHT * this.props.rowLength;
  }

  createBaseStyles() {
    return {
      width: this._calculateWidth(),
      height: this._calculateHeight(),
    };
  }

  createSquares() {
    return Array.from({ length: this.props.rowLength }).map((notUsed, rowIndex) => {
      return Array.from({ length: this.props.columnLength }).map((notUsed, columnIndex) => {
        return React.createElement(Square, {
          key: `square-${ rowIndex }-${ columnIndex }`,
          rowIndex,
          columnIndex,
        });
      });
    });
  }
}

Object.assign(Board, {
  propTypes: {
    rowLength: React.PropTypes.number.isRequired,
    columnLength: React.PropTypes.number.isRequired,
  },
});

module.exports = Board;
