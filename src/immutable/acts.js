/**
 * @typedef {Object} Immutable~Act
 */


/** @module */
const dictify = require('dictify');
const keymirror = require('keymirror');


const fixtures = [
  {
    id: 'MAGICAL_BLAST',
    friendshipType: 'UNFRIENDLY',
    aimRange: {
      type: 'REACHABLE',
      reach: 2,
    },
    effectRange: {
      type: 'BALL',
      // TODO: -> bullet: { speed } ?
      bulletSpeed: 12,
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
    effectRange: {
      type: 'UNIT',
      bulletSpeed: 9999,
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
    effectRange: {
      type: 'UNIT',
      bulletSpeed: 9999,
    },
    effectParameters: {
      damagePoints: 0,
      healingPoints: 1,
    },
  },
];


const baseAct = {
  id: null,
  friendshipType: null,
  aimRange: null,
  effectRange: null,
  effectParameters: null,
};

const actList = fixtures.map(fixture => {
  const act =  Object.assign({}, baseAct, fixture);

  if (!act.id || !act.friendshipType || !act.aimRange || !act.effectRange) {
    throw new Error(`act.id="${ act.id }" is invalid`);
  }

  return act;
});
const acts = dictify(actList, 'id');
const ACT_IDS = keymirror(acts);


module.exports = {
  ACT_IDS,
  actList,
  acts,
  baseAct,
};
