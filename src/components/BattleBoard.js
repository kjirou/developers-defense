const React = require('react');
const { connect } = require('react-redux');

const Board = require('./presentational/Board');
const Square = require('./presentational/Square');


const SquaresMatrix = ({ squaresMatrix }) => {
  const serialSquareComponents = squaresMatrix.map(rowSquares => {
    return rowSquares.map(square => {
      return React.createElement(Square, {
        rowIndex: square.coordinate[0],
        columnIndex: square.coordinate[1],
        landformType: square.landformType,
      });
    });
  });
  return React.createElement('div', {}, serialSquareComponents);
};

class BattleBoard extends Board {
  render() {
    const styles = this.createBaseStyles();
    return <div className="root__battle-board" style={ styles }>
      <SquaresMatrix squaresMatrix={ this.props.battleSquares } />
    </div>;
  }
}

BattleBoard = connect(state => state)(BattleBoard);

module.exports = BattleBoard;


//class Board extends React.Component {
//  _calculateWidth() {
//    return STYLES.SQUARE_WIDTH * this.props.columnLength;
//  }
//
//  _calculateHeight() {
//    return STYLES.SQUARE_HEIGHT * this.props.rowLength;
//  }
//
//  createBaseStyles() {
//    return {
//      width: this._calculateWidth(),
//      height: this._calculateHeight(),
//    };
//  }
//
//  createSquares() {
//    return Array.from({ length: this.props.rowLength }).map((notUsed, rowIndex) => {
//      return Array.from({ length: this.props.columnLength }).map((notUsed, columnIndex) => {
//        return React.createElement(Square, {
//          key: `square-${ rowIndex }-${ columnIndex }`,
//          rowIndex,
//          columnIndex,
//        });
//      });
//    });
//  }
//}
//
//Object.assign(Board, {
//  propTypes: {
//    rowLength: React.PropTypes.number.isRequired,
//    columnLength: React.PropTypes.number.isRequired,
//  },
//});
//
//module.exports = Board;
