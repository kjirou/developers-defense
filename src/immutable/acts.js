const { createClassBasedResourceList } = require('@kjirou/utils');
const dictify = require('dictify');
const keymirror = require('keymirror');
const S = require('string');


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
      id: 'MELEE_FIGHT',
      aimRange: {
        type: 'REACHABLE',
        reach: 1,
        friendshipType: 'UNFRIENDLY',
      },
      effectRange: {
        type: 'INDIVIDUAL',
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
        type: 'INDIVIDUAL',
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
  naming: ({ Resource }) => {
    return S(Resource.id).capitalize().s + Act.name;
  },
});
const acts = dictify(actList, 'id');
const ACT_IDS = keymirror(actions);


module.exports = {
  ACT_IDS,
  Act,
  actList,
  acts,
};
