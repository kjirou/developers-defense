/**
 * @typedef {Object} Immutable~Act
 */


/** @module */
const dictify = require('dictify');
const keymirror = require('keymirror');

const { ACT_EFFECT_RANGE_TYPES, EFFECT_DIRECTIONS } = require('./constants');
const { expandReachToRelativeCoordinates } = require('../lib/core');


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
      radius: 2,
    },
    effectParameters: {
      damagePoints: 1,
      healingPoints: 0,
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
  },
];


/**
 * @param {Object} effectRange - Props are determined for each `effectRange.type`
 * @param {?string} effectDirection - One of EFFECT_DIRECTIONS
 * @return {Array<Array<number>>}
 */
const _expandEffectRangeToRelativeCoordinates = (effectRange, direction) => {
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
  id: null,
  friendshipType: null,
  aimRange: null,
  effectRange: null,
  effectParameters: null,

  expandEffectRangeToRelativeCoordinates(direction) {
    return _expandEffectRangeToRelativeCoordinates(this.effectRange, direction);
  },
};

const actList = fixtures.map(fixture => {
  const act =  Object.assign({}, baseAct, fixture);

  if (!act.id || !act.friendshipType || !act.aimRange || !act.effectRange || !act.effectParameters) {
    throw new Error(`act.id="${ act.id }" is invalid`);
  }

  return act;
});
const acts = dictify(actList, 'id');
const ACT_IDS = keymirror(acts);


module.exports = {
  _expandEffectRangeToRelativeCoordinates,
  ACT_IDS,
  actList,
  acts,
  baseAct,
};
