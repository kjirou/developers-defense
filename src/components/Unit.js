const React = require('react');

const { STYLES, UNIT_STATE_CHANGE_LOG_TYPES } = require('../immutable/constants');


class Unit extends React.Component {
  static _generateStateChangeEffectData({ type, value }/*:UnitStateChangeLogState*/) {
    let text = '';
    const additionalClassNames = [];

    switch (type) {
      case UNIT_STATE_CHANGE_LOG_TYPES.DAMAGE: {
        text = String(value);
        additionalClassNames.push('unit-state-change-effect--damage-points');
        break;
      }
      case UNIT_STATE_CHANGE_LOG_TYPES.HEALING: {
        text = String(value);
        additionalClassNames.push('unit-state-change-effect--healing-points');
        break;
      }
    }

    return {
      text,
      additionalClassNames,
    };
  }

  static _animateStateChangeEffects(
    unitStateChangeLogs/*:UnitStateChangeLogState[]*/,
    containerDomNode/*:Object*/,
    effectDuration/*:number*/,
    intervalOfContinuousCreation/*:number*/
  ) {
    unitStateChangeLogs.forEach((unitStateChangeLog, stateChangeIndex) => {
      const uidAttrName = 'data-uid';

      if (containerDomNode.querySelector(`[${ uidAttrName }="${ unitStateChangeLog.uid }"]`)) {
        return;
      }

      const { text, additionalClassNames } = Unit._generateStateChangeEffectData(unitStateChangeLog);

      const effectNode = document.createElement('div');
      effectNode.setAttribute(uidAttrName, unitStateChangeLog.uid);
      effectNode.classList.add('unit-state-change-effect', ...additionalClassNames);
      effectNode.textContent = text;

      setTimeout(() => {
        containerDomNode.appendChild(effectNode);
        setTimeout(() => {
          containerDomNode.removeChild(effectNode);
        }, effectDuration);
      }, intervalOfContinuousCreation * stateChangeIndex);
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
        uid: React.PropTypes.string.isRequired,
        unitUid: React.PropTypes.string.isRequired,
        tickId: React.PropTypes.number.isRequired,
        type: React.PropTypes.string.isRequired,
        value: React.PropTypes.any.isRequired,
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
