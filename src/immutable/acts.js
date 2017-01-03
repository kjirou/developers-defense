const { createClassBasedResourceList } = require('@kjirou/utils');
const dictify = require('dictify');
const keymirror = require('keymirror');

const { underscoredToClassName } = require('../lib/core');


const fixture = [
  {
    constants: {
      id: 'MAGICAL_BLAST',
      aimRange: {
        type: 'REACHABLE',
        reach: 2,
        friendshipType: 'UNFRIENDLY',
      },
      effectRange: {
        type: 'BALL',
        radius: 2,
      },
    },
  },
  {
    constants: {
      id: 'MELEE_ATTACK',
      aimRange: {
        type: 'REACHABLE',
        reach: 1,
        friendshipType: 'UNFRIENDLY',
      },
      effectRange: {
        type: 'UNIT',
        count: 1,
      },
    },
  },
  {
    constants: {
      id: 'TREATMENT',
      aimRange: {
        type: 'REACHABLE',
        reach: 1,
        friendshipType: 'FRIENDLY',
      },
      effectRange: {
        type: 'UNIT',
        count: 1,
      },
    },
  },
];


class Act {
}

Object.assign(Act, {
  id: null,
  aimRange: null,
  effectRange: null,
});


const actList = createClassBasedResourceList(Act, fixture, {
  naming: ({ Resource }) => underscoredToClassName(Resource.id) + Act.name,
});
const acts = dictify(actList, 'id');
const ACT_IDS = keymirror(acts);

actList.forEach(act => {
  if (!act.id || !act.aimRange || !act.effectRange) {
    throw new Error(`Act.id="${ act.id }" is invalid`);
  }
});


module.exports = {
  ACT_IDS,
  Act,
  actList,
  acts,
};
