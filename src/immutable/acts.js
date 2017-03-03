// @flow

/*::
import type { AnimationDestinationType, FriendshipType } from './constants';
 */

const keyBy = require('lodash.keyby');
const keymirror = require('keymirror');

const { ACT_EFFECT_RANGE_TYPES, EFFECT_DIRECTIONS } = require('./constants');
const { expandReachToRelativeCoordinates } = require('../lib/core');


/*::
type EffectRangeFixtureField = (
  {
    type: 'UNIT',
  } | {
    type: 'BALL',
    radius: number,
  }
);

export type ActImmutableObject = {
  id: string,
  friendshipType: FriendshipType,
  aimRange: (
    {
      type: 'REACHABLE',
      reach: number,
    }
  ),
  bullet: {
    speed: number,
  },
  effectRange: EffectRangeFixtureField,
  effectParameters: {
    damagePoints: number,
    healingPoints: number,
  },
  effectAnimation: {
    id: string,
    destinationType: AnimationDestinationType,
  },
  expandEffectRangeToRelativeCoordinates: Function,
};
 */

const fixtures = [
  {
    id: 'MAGICAL_BLAST',
    friendshipType: 'UNFRIENDLY',
    aimRange: {
      type: 'REACHABLE',
      reach: 2,
    },
    bullet: {
      speed: 12,
    },
    effectRange: {
      type: 'BALL',
      radius: 1,
    },
    effectParameters: {
      damagePoints: 1,
      healingPoints: 0,
    },
    effectAnimation: {
      id: 'SHOCK_RED',
      destinationType: 'SQUARE',
    },
  },
  {
    id: 'MELEE_ATTACK',
    friendshipType: 'UNFRIENDLY',
    aimRange: {
      type: 'REACHABLE',
      reach: 1,
    },
    bullet: {
      speed: 9999,
    },
    effectRange: {
      type: 'UNIT',
    },
    effectParameters: {
      damagePoints: 1,
      healingPoints: 0,
    },
    effectAnimation: {
      id: 'SHOCK_RED',
      destinationType: 'UNIT',
    },
  },
  {
    id: 'TREATMENT',
    friendshipType: 'FRIENDLY',
    aimRange: {
      type: 'REACHABLE',
      reach: 1,
    },
    bullet: {
      speed: 9999,
    },
    effectRange: {
      type: 'UNIT',
    },
    effectParameters: {
      damagePoints: 0,
      healingPoints: 1,
    },
    effectAnimation: {
      id: 'SHOCK_BLUE',
      destinationType: 'UNIT',
    },
  },
];


/**
 * @param effectRange - Props are determined for each `effectRange.type`
 * @param effectDirection - One of EFFECT_DIRECTIONS
 */
const _expandEffectRangeToRelativeCoordinates = (
  effectRange/*:EffectRangeFixtureField*/, direction/*:string*/
)/*:number[][]*/ => {
  let relativeCoordinates = [];

  if (effectRange.type === ACT_EFFECT_RANGE_TYPES.BALL) {
    const {
      radius
    } = effectRange;
    relativeCoordinates = expandReachToRelativeCoordinates(0, radius);
  } else {
    throw new Error(`Invalid effectRange.type=${ effectRange.type }`);
  }

  return relativeCoordinates;
};


const baseAct = {
  expandEffectRangeToRelativeCoordinates(direction/*:string*/) {
    return _expandEffectRangeToRelativeCoordinates(this.effectRange, direction);
  },
};

const fixtureToAct = (fixture/*:Object*/)/*:ActImmutableObject*/ => {
  const act = Object.assign({}, baseAct, fixture);

  if (
    !act.id ||
    !act.friendshipType ||
    !act.aimRange ||
    !act.effectRange ||
    !act.effectParameters ||
    !act.effectAnimation
  ) {
    throw new Error(`act.id="${ act.id }" is invalid`);
  }

  return act;
};

const actList/*:ActImmutableObject[]*/ = fixtures.map(fixtureToAct);
const acts/*:{[id:string]: ActImmutableObject}*/ = keyBy(actList, 'id');
const ACT_IDS/*:{[id:string]: string}*/ = keymirror(acts);


module.exports = {
  _expandEffectRangeToRelativeCoordinates,
  ACT_IDS,
  actList,
  acts,
};
