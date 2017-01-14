const React = require('react');

const { PARAMETERS } = require('../immutable/constants');


const Bullet = ({ classNames, top, left }) => {
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

Object.assign(Bullet, {
  propTypes: {
    top: React.PropTypes.number.isRequired,
    left: React.PropTypes.number.isRequired,
    classNames: React.PropTypes.arrayOf(
      React.PropTypes.string.isRequired
    ),
  },
  defaultProps: {
    classNames: [],
  },
});


module.exports = Bullet;
