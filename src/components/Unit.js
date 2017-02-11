const React = require('react');


class Unit extends React.Component {
  constructor(...args) {
    super(...args);

    this._animationContainerDomNode = null;
  }

  componentDidUpdate() {
    // Execute animations
    // TODO: Add UI tests
    this.props.animations.forEach(({ uid, duration, classNames }) => {
      const uidAttrName = 'data-uid';

      // If the DOM element remains, the animation is deemed to have been executed.
      if (this._animationContainerDomNode.querySelector(`[${ uidAttrName }="${ uid }"]`)) {
        return;
      }

      const animatedNode = document.createElement('div');
      animatedNode.setAttribute(uidAttrName, uid);
      animatedNode.classList.add(...classNames);

      this._animationContainerDomNode.appendChild(animatedNode);
      setTimeout(() => {
        if (this._animationContainerDomNode) {
          this._animationContainerDomNode.removeChild(animatedNode);
        }
      }, duration);
    });
  }

  render() {
    const { iconId, top, left, classNames } = this.props;

    const mergedClassNames = ['unit'].concat(classNames);

    const styles = {
      top,
      left,
    };

    const props = {
      className: mergedClassNames.join(' '),
      style: styles,
    };

    const animationContainer = React.createElement('div', {
      key: 'animaion-container',
      className: 'unit__animation-container',
      ref: (node) => { this._animationContainerDomNode = node; },
    });

    const icon = React.createElement('i', {
      key: 'icon',
      className: ['ra', iconId, 'ra-2x', 'unit__icon'].join(' '),
    });

    return React.createElement('div', props, animationContainer, icon);
  }
}

Object.assign(Unit, {
  propTypes: {
    iconId: React.PropTypes.string.isRequired,
    top: React.PropTypes.number.isRequired,
    left: React.PropTypes.number.isRequired,
    classNames: React.PropTypes.arrayOf(
      React.PropTypes.string.isRequired
    ),
    animations: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        classNames: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired,
        duration: React.PropTypes.number.isRequired,
        uid: React.PropTypes.string.isRequired,
      }).isRequired
    ),
  },
  defaultProps: {
    classNames: [],
    animations: [],
  },
});


module.exports = Unit;
