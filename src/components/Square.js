// @flow

/*::
import type { LandformType } from '../immutable/constants';
 */

const React = require('react');

const { LANDFORM_TYPES, STYLES } = require('../immutable/constants');


/*::
type Props = {
  rowIndex: number,
  columnIndex: number,
  landformType: LandformType,
};

type DefaultProps = {
  landformType?: $PropertyType<Props, 'landformType'>,
};

export type SquareProps = {
  ...DefaultProps,
  rowIndex: $PropertyType<Props, 'rowIndex'>,
  columnIndex: $PropertyType<Props, 'columnIndex'>,
};
 */

const defaultProps/*:DefaultProps*/ = {
  landformType: LANDFORM_TYPES.NONE,
};

const Square = ({ rowIndex, columnIndex, landformType }/*:Props*/) => {
  const styles = {
    top: STYLES.SQUARE_HEIGHT * rowIndex,
    left: STYLES.SQUARE_WIDTH * columnIndex,
  };

  const classNames = ['square'];
  if (landformType !== LANDFORM_TYPES.NONE) {
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

Square.defaultProps = defaultProps;


module.exports = Square;
