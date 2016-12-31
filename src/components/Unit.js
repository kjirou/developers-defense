const React = require('react');


const Unit = ({ iconId, top, left, classNames }) => {
  const props = {
    className: ['unit'].concat(classNames).join(' '),
    style: {
      top,
      left,
    },
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
