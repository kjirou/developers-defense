const React = require('react');

const { LANDFORM_TYPES, STYLES } = require('../immutable/constants');


const Square = ({ rowIndex, columnIndex, landformType }) => {
  const styles = {
    top: STYLES.SQUARE_HEIGHT * rowIndex,
    left: STYLES.SQUARE_WIDTH * columnIndex,
  };

  const classNames = ['square'];
  if (landformType !== null) {
    classNames.push({
      [LANDFORM_TYPES.CASTLE]: 'square--landform-castle',
      [LANDFORM_TYPES.DESERT]: 'square--landform-desert',
      [LANDFORM_TYPES.FOREST]: 'square--landform-forest',
      [LANDFORM_TYPES.FORT]: 'square--landform-fort',
      [LANDFORM_TYPES.GRASSFIELD]: 'square--landform-grassfield',
      [LANDFORM_TYPES.MOUNTAIN]: 'square--landform-mountain',
      [LANDFORM_TYPES.RIVER]: 'square--landform-river',
      [LANDFORM_TYPES.ROAD]: 'square--landform-road',
    }[landformType])
  }

  return React.createElement('div', {
    className: classNames.join(' '),
    style: styles,
  });
};

Object.assign(Square, {
  propTypes: {
    rowIndex: React.PropTypes.number.isRequired,
    columnIndex: React.PropTypes.number.isRequired,
    landformType: React.PropTypes.string,
  },
  defaultProps: {
    landformType: null,
  },
});

module.exports = Square;
