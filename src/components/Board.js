// @flow

/*::
import type { Children } from 'react';
 */

const React = require('react');

const { STYLES } = require('../immutable/constants');


/*::
type Props = {
  additionalClassNames: string[],
  children: Children,
  columnLength: number,
  rowLength: number,
};

type DefaultProps = {
  additionalClassNames?: $PropertyType<Props, 'additionalClassNames'>,
};

export type BoardProps = {
  ...DefaultProps,
  children?: $PropertyType<Props, 'children'>,
  columnLength: $PropertyType<Props, 'columnLength'>,
  rowLength: $PropertyType<Props, 'rowLength'>,
};
 */

const defaultProps = {
  additionalClassNames: [],
};

const Board = ({ children, rowLength, columnLength, additionalClassNames }/*:Props*/) => {
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

Board.defaultProps = defaultProps;


module.exports = Board;
