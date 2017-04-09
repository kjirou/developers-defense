// @flow

/*::
import type { UnitStateChangeType } from '../immutable/constants';
import type { UnitStateChangeLogState } from '../types/states';
 */

const React = require('react');

const { STYLES, UNIT_STATE_CHANGE_LOG_TYPES } = require('../immutable/constants');
const Gauge = require('./Gauge');

const h = React.createElement;


/*::
export type UnitAnimationProps = {
  classNames: string[],
  duration: number,
  uid: string,
};

export type UnitStateChangeProps = {
  type: UnitStateChangeType,
  uid: string,
  value: $PropertyType<UnitStateChangeLogState, 'value'>,
};

type Props = {
  animations: UnitAnimationProps[],
  classNames: string[],
  iconId: string,
  hitPointsRate: number,
  left: number,
  stateChanges: UnitStateChangeProps[],
  top: number,
  uid: string,
}

type DefaultProps = {
  animations: UnitAnimationProps[],
  classNames: $PropertyType<Props, 'classNames'>,
  movableDistance: number | null,
  stateChanges: $PropertyType<Props, 'stateChanges'>,
};

export type UnitProps = {
  ...DefaultProps,
  iconId: $PropertyType<Props, 'iconId'>,
  hitPointsRate: $PropertyType<Props, 'hitPointsRate'>,
  left: $PropertyType<Props, 'left'>,
  top: $PropertyType<Props, 'top'>,
  uid: $PropertyType<Props, 'uid'>,
};
 */

const defaultProps = {
  animations: [],
  classNames: [],
  movableDistance: null,
  stateChanges: [],
};

class Unit extends React.Component {
  static _runAnimations(animations/*:UnitAnimationProps[]*/, containerDomNode/*:HTMLElement*/) {
    animations.forEach(({ uid, duration, classNames }) => {
      const uidAttrName = 'data-uid';

      if (containerDomNode.querySelector(`[${ uidAttrName }="${ uid }"]`)) {
        return;
      }

      const animatedNode = document.createElement('div');
      animatedNode.setAttribute(uidAttrName, uid);
      animatedNode.classList.add(...classNames);

      containerDomNode.appendChild(animatedNode);
      setTimeout(() => {
        containerDomNode.removeChild(animatedNode);
      }, duration);
    });
  }

  static _generateStateChangeEffectData({ type, value }/*:UnitStateChangeProps*/) {
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
    stateChanges/*:UnitStateChangeProps[]*/,
    containerDomNode/*:HTMLElement*/,
    effectDuration/*:number*/,
    intervalOfContinuousCreation/*:number*/
  ) {
    stateChanges.forEach((stateChange, stateChangeIndex) => {
      const uidAttrName = 'data-uid';

      if (containerDomNode.querySelector(`[${ uidAttrName }="${ stateChange.uid }"]`)) {
        return;
      }

      const { text, additionalClassNames } = Unit._generateStateChangeEffectData(stateChange);

      const effectNode = document.createElement('div');
      effectNode.setAttribute(uidAttrName, stateChange.uid);
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

  /*::
  static defaultProps: DefaultProps;

  props: Props;

  _animationContainerDomNode: HTMLElement;
  _stateChangeEffectContainerDomNode: HTMLElement;
   */

  componentDidUpdate() {
    Unit._runAnimations(this.props.animations, this._animationContainerDomNode);

    Unit._animateStateChangeEffects(
      this.props.stateChanges,
      this._stateChangeEffectContainerDomNode,
      STYLES.UNIT_STATE_CHANGE_EFFECT_DURATION,
      250
    );
  }

  render() {
    const myProps = {
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

    let movableDistance = null;
    if (this.props.movableDistance !== null) {
      movableDistance = h('div', {
        key: 'movable-distance',
        className: 'unit__movable-distance',
      }, this.props.movableDistance);
    }

    // TODO: `gauge` -> `hitPointsGauge`
    let gauge = null;
    if (0.0 < this.props.hitPointsRate && this.props.hitPointsRate < 1.0) {
      gauge = React.createElement(Gauge, {
        key: 'hit-points-gauge',
        frameWidth: 1,
        width: 32,
        height: 6,
        rate: this.props.hitPointsRate,
        classNames: ['unit__hit-points-gauge'],
      });
    }

    const icon = React.createElement('i', {
      key: 'icon',
      className: ['ra', this.props.iconId, 'ra-2x', 'unit__icon'].join(' '),
    });

    const components = [];
    components.push(stateChangeEffectContainer);
    components.push(animationContainer);
    if (gauge) {
      components.push(gauge);
    }
    if (movableDistance) {
      components.push(movableDistance);
    }
    components.push(icon);

    return React.createElement('div', myProps, ...components);
  }
}

Unit.defaultProps = defaultProps;


module.exports = Unit;
