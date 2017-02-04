/**
 * @typedef {Object} Immutable~Job
 */


/** @module */
const dictify = require('dictify');
const keymirror = require('keymirror');


const fixtures = [
  {
    id: 'BANDIT',
    iconId: 'ra-muscle-up',
    maxHitPoints: 8,
    attackPower: 2,
    defensePower: 0,
  },
  {
    id: 'DRAGON',
    iconId: 'ra-dragon',
    maxHitPoints: 50,
    attackPower: 8,
    defensePower: 5,
  },
  {
    id: 'FIGHTER',
    iconId: 'ra-sword',
    maxHitPoints: 10,
    attackPower: 3,
    defensePower: 2,
  },
  {
    id: 'HEALER',
    iconId: 'ra-health',
    maxHitPoints: 8,
    defensePower: 1,
  },
  {
    id: 'MAGE',
    iconId: 'ra-crystal-wand',
    maxHitPoints: 3,
    mattackPower: 3,
    mdefensePower: 1,
  },
  {
    id: 'NONE',
    iconId: 'ra-player',
  },
  {
    id: 'SNAKE',
    iconId: 'ra-venomous-snake',
    maxHitPoints: 2,
    attackPower: 2,
    defensePower: 0,
  },
];


const baseJob = {
  id: null,
  iconId: null,
  maxHitPoints: 0,
  attackPower: 0,
  defensePower: 0,
  mattackPower: 0,
  mdefensePower: 0,
};

const jobList = fixtures.map(fixture => {
  const job = Object.assign({}, baseJob, fixture);

  if (!job.id || !job.iconId) {
    throw new Error(`job.id="${ job.id }" is invalid`);
  }

  return job;
});
const jobs = dictify(jobList, 'id');
const JOB_IDS = keymirror(jobs);


module.exports = {
  JOB_IDS,
  baseJob,
  jobList,
  jobs,
};
