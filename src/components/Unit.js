const React = require('react');

const { STYLES } = require('../immutable/constants');


class Unit extends React.Component {
  constructor(...args) {
    super(...args);

    this._effectContainerDomNode = null;
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

    // Execute effects
    // TODO: Add UI tests
    this.props.effects.forEach(({ uid, damagePoints, healingPoints }) => {
      const uidAttrName = 'data-uid';

      // If the DOM element remains, the animation is deemed to have been executed.
      if (this._effectContainerDomNode.querySelector(`[${ uidAttrName }="${ uid }"]`)) {
        return;
      }

      const messages = [];

      if (typeof damagePoints === 'number') {
        messages.push({ text: String(damagePoints), addionalClassNames: ['unit-state-change-effect--damage-points'] });
      }
      if (typeof healingPoints === 'number') {
        messages.push({ text: String(healingPoints), addionalClassNames: ['unit-state-change-effect--healing-points'] });
      }

      messages.forEach(({ text, addionalClassNames }, messageIndex) => {
        const effectNode = document.createElement('div');
        effectNode.setAttribute(uidAttrName, uid);
        effectNode.classList.add('unit-state-change-effect', ...addionalClassNames);
        effectNode.textContent = text;

        setTimeout(() => {
          this._effectContainerDomNode.appendChild(effectNode);
          setTimeout(() => {
            if (this._effectContainerDomNode) {
              this._effectContainerDomNode.removeChild(effectNode);
            }
          }, STYLES.UNIT_STATE_CHANGE_EFFECT_DURATION);
        }, messageIndex * STYLES.UNIT_STATE_CHANGE_EFFECT_DURATION / 4);
      });
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

    const effectContainer = React.createElement('div', {
      key: 'effect-container',
      className: 'unit__effect-container',
      ref: (node) => { this._effectContainerDomNode = node; },
    });

    const animationContainer = React.createElement('div', {
      key: 'animaion-container',
      className: 'unit__animation-container',
      ref: (node) => { this._animationContainerDomNode = node; },
    });

    const icon = React.createElement('i', {
      key: 'icon',
      className: ['ra', iconId, 'ra-2x', 'unit__icon'].join(' '),
    });

    return React.createElement('div', props, effectContainer, animationContainer, icon);
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
    effects: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        damagePoints: React.PropTypes.number,
        healingPoints: React.PropTypes.number,
        uid: React.PropTypes.string.isRequired,
      }).isRequired
    ),
  },
  defaultProps: {
    classNames: [],
    animations: [],
    effects: [],
  },
});


module.exports = Unit;
