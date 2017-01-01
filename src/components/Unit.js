const React = require('react');

const { PARAMETERS } = require('../immutable/constants');


const Unit = ({ iconId, top, left, classNames }) => {
  const mergedClassNames = ['unit'].concat(classNames);

  const durationStr = `${ PARAMETERS.TICK_INTERVAL }ms`;
  const styles = {
    top,
    left,
    transition: `top ${ durationStr } linear, left ${ durationStr } linear`,
  };

  const props = {
    className: mergedClassNames.join(' '),
    style: styles,
  };

  const icon = React.createElement('i', {
    // TODO: rpg-awesome 固定なら iconId も短縮できる
    className: ['ra', iconId, 'ra-2x'].join(' '),
  });

  return React.createElement('div', props, icon);
};

Object.assign(Unit, {
  propTypes: {
    iconId: React.PropTypes.string.isRequired,
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


module.exports = Unit;
