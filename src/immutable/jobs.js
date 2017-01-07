/**
 * @typedef {Function} Immutable~Job
 */


/** @module */
const { createClassBasedResourceList } = require('@kjirou/utils');
const dictify = require('dictify');
const keymirror = require('keymirror');

const { underscoredToClassName } = require('../lib/core');


const fixture = [
  {
    constants: {
      id: 'FIGHTER',
      iconId: 'ra-sword',
      maxHitPoints: 10,
      attackPower: 3,
      defensePower: 2,
    },
  },
  {
    constants: {
      id: 'HEALER',
      iconId: 'ra-health',
      maxHitPoints: 8,
      defensePower: 1,
    },
  },
  {
    constants: {
      id: 'MAGE',
      iconId: 'ra-crystal-wand',
      maxHitPoints: 3,
      mattackPower: 3,
      mdefensePower: 1,
    },
  },
  {
    constants: {
      id: 'NONE',
      iconId: 'ra-player',
    },
  },
];


class Job {
}

Object.assign(Job, {
  id: null,
  iconId: null,
  maxHitPoints: 0,
  attackPower: 0,
  defensePower: 0,
  mattackPower: 0,
  mdefensePower: 0,
});


const jobList = createClassBasedResourceList(Job, fixture, {
  naming: ({ Resource }) => underscoredToClassName(Resource.id) + Job.name,
});
const jobs = dictify(jobList, 'id');
const JOB_IDS = keymirror(jobs);


jobList.forEach(job => {
  if (!job.id || !job.iconId) {
    throw new Error(`Job.id="${ act.id }" is invalid`);
  }
});


module.exports = {
  JOB_IDS,
  Job,
  jobList,
  jobs,
};
