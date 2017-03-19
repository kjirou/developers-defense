// @flow

const React = require('react');

const { PARAMETERS } = require('../immutable/constants');


/*::
type Props = {
  top: number,
  left: number,
  classNames: string[],
}
 */

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

Bullet.defaultProps = {
  classNames: [],
};


module.exports = Bullet;
