const React = require('react');

const { STYLES } = require('../../consts');


const Square = ({ rowIndex, columnIndex }) => {
  const styles = {
    top: STYLES.SQUARE_HEIGHT * rowIndex,
    left: STYLES.SQUARE_WIDTH * columnIndex,
  };

  const text = `[${ rowIndex }, ${ columnIndex }]`;
  return <div className="square" style={ styles }>
    <div>{ text }</div>
    <i className="ra ra-broadsword" />
  </div>;
};

Object.assign(Square, {
  propTypes: {
    rowIndex: React.PropTypes.number.isRequired,
    columnIndex: React.PropTypes.number.isRequired,
  },
});

module.exports = Square;
