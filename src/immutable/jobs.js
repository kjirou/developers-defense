// @flow

const keyBy = require('lodash.keyby');
const keymirror = require('keymirror');


/*::
export type JobImmutableObject = {
  id: string,
  iconId: string,
  maxHitPoints: number,
  attackPower: number,
  mattackPower: number,
  defensePower: number,
  mdefensePower: number,
};
 */

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
  maxHitPoints: 0,
  attackPower: 0,
  defensePower: 0,
  mattackPower: 0,
  mdefensePower: 0,
};

const fixtureToJob = (fixture/*:Object*/)/*:JobImmutableObject*/ => {
  const job = Object.assign({}, baseJob, fixture);

  if (
    !job.id ||
    !job.iconId
  ) {
    throw new Error(`job.id="${ job.id }" is invalid`);
  }

  return job;
};

const jobList/*:JobImmutableObject[]*/ = fixtures.map(fixtureToJob);
const jobs/*:{[id:string]: JobImmutableObject}*/ = keyBy(jobList, 'id');
const JOB_IDS/*:{[id:string]: string}*/ = keymirror(jobs);


module.exports = {
  JOB_IDS,
  baseJob,
  jobList,
  jobs,
};
