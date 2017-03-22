// @flow

const React = require('react');

const { PARAMETERS } = require('../immutable/constants');


/*::
type Props = {
  classNames: string[],
  left: number,
  top: number,
  uid: string,
};

type DefaultProps = {
  classNames: $PropertyType<Props, 'classNames'>,
};

export type BulletProps = {
  classNames?: $PropertyType<Props, 'classNames'>,
  left: $PropertyType<Props, 'left'>,
  top: $PropertyType<Props, 'top'>,
  uid: $PropertyType<Props, 'uid'>,
};
 */

const defaultProps/*:DefaultProps*/ = {
  classNames: [],
};

const Bullet = ({ classNames, top, left }/*:Props*/) => {
  // TODO: The movement of the last one turn is slow
  const durationStr = `${ PARAMETERS.TICK_INTERVAL }ms`;

  const styles = {
    top: top - 4,
    left: left - 4,
    transition: `top ${ durationStr } linear, left ${ durationStr } linear`,
  };

  const defaultedClassNames = ['bullet'].concat(classNames);

  return React.createElement('div', {
    className: defaultedClassNames.join(' '),
    style: styles,
  });
};

Bullet.defaultProps = defaultProps;


module.exports = Bullet;
