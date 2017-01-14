/**
 * @typedef {Function} Immutable~Act
 */


/** @module */
const { createClassBasedResourceList } = require('@kjirou/utils');
const dictify = require('dictify');
const keymirror = require('keymirror');

const { underscoredToClassName } = require('../lib/core');


const fixture = [
  {
    constants: {
      id: 'MAGICAL_BLAST',
      friendshipType: 'UNFRIENDLY',
      aimRange: {
        type: 'REACHABLE',
        reach: 2,
      },
      effectRange: {
        type: 'BALL',
        bulletSpeed: 24,
        radius: 2,
      },
    },
  },
  {
    constants: {
      id: 'MELEE_ATTACK',
      friendshipType: 'UNFRIENDLY',
      aimRange: {
        type: 'REACHABLE',
        reach: 1,
      },
      effectRange: {
        type: 'UNIT',
        bulletSpeed: 9999,
        count: 1,
      },
    },
  },
  {
    constants: {
      id: 'TREATMENT',
      friendshipType: 'FRIENDLY',
      aimRange: {
        type: 'REACHABLE',
        reach: 1,
      },
      effectRange: {
        type: 'UNIT',
        bulletSpeed: 9999,
        count: 1,
      },
    },
  },
];


class Act {
}

Object.assign(Act, {
  id: null,
  friendshipType: null,
  aimRange: null,
  effectRange: null,
});


const actList = createClassBasedResourceList(Act, fixture, {
  naming: ({ Resource }) => underscoredToClassName(Resource.id) + Act.name,
});
const acts = dictify(actList, 'id');
const ACT_IDS = keymirror(acts);


actList.forEach(act => {
  if (!act.id || !act.friendshipType || !act.aimRange || !act.effectRange) {
    throw new Error(`Act.id="${ act.id }" is invalid`);
  }
});


module.exports = {
  ACT_IDS,
  Act,
  actList,
  acts,
};
