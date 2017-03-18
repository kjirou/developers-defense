const React = require('react');

const { STYLES } = require('../immutable/constants');


class Unit extends React.Component {
  /**
   * @param {Object[]} stateChanges
   * @param {HTMLElement} containerDomNode
   * @param {number} effectDuration
   * @param {number} intervalOfContinuousCreation
   */
  static _animateStateChangeEffects(stateChanges, containerDomNode, effectDuration, intervalOfContinuousCreation) {
    stateChanges.forEach(({ uid, damagePoints, healingPoints }) => {
      const uidAttrName = 'data-uid';

      // If the DOM element remains, the animation is deemed to have been executed.
      if (containerDomNode.querySelector(`[${ uidAttrName }="${ uid }"]`)) {
        return;
      }

      const messages = [];

      if (damagePoints !== null) {
        messages.push({
          text: String(damagePoints),
          additionalClassNames: ['unit-state-change-effect--damage-points'],
        });
      }
      if (healingPoints !== null) {
        messages.push({
          text: String(healingPoints),
          additionalClassNames: ['unit-state-change-effect--healing-points'],
        });
      }

      messages.forEach(({ text, additionalClassNames }, messageIndex) => {
        const effectNode = document.createElement('div');
        effectNode.setAttribute(uidAttrName, uid);
        effectNode.classList.add('unit-state-change-effect', ...additionalClassNames);
        effectNode.textContent = text;

        setTimeout(() => {
          if (containerDomNode.parentNode) {
            containerDomNode.appendChild(effectNode);
            setTimeout(() => {
              if (containerDomNode.parentNode) {
                containerDomNode.removeChild(effectNode);
              }
            }, effectDuration);
          }
        }, intervalOfContinuousCreation * messageIndex);
      });
    });
  }

  constructor(...args) {
    super(...args);

    this._stateChangeEffectContainerDomNode = null;
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

    Unit._animateStateChangeEffects(
      this.props.stateChanges,
      this._stateChangeEffectContainerDomNode,
      STYLES.UNIT_STATE_CHANGE_EFFECT_DURATION,
      250
    );
  }

  render() {
    const props = {
      className: ['unit'].concat(this.props.classNames).join(' '),
      style: {
        top: this.props.top,
        left: this.props.left,
      },
    };

    const stateChangeEffectContainer = React.createElement('div', {
      key: 'state-change-effect-container',
      className: 'unit__state-change-effect-container',
      ref: node => {
        this._stateChangeEffectContainerDomNode = node;
      },
    });

    const animationContainer = React.createElement('div', {
      key: 'animaion-container',
      className: 'unit__animation-container',
      ref: node => {
        this._animationContainerDomNode = node;
      },
    });

    const icon = React.createElement('i', {
      key: 'icon',
      className: ['ra', this.props.iconId, 'ra-2x', 'unit__icon'].join(' '),
    });

    return React.createElement('div', props, stateChangeEffectContainer, animationContainer, icon);
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
    stateChanges: React.PropTypes.arrayOf(
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
    stateChanges: [],
  },
});


module.exports = Unit;
