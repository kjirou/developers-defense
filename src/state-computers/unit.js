const uuidV4 = require('uuid/v4');

const { FACTION_TYPES, PARAMETERS } = require('../immutable/constants');
const { JOB_IDS, jobs } = require('../immutable/jobs');


const createInitialUnitState = () => {
  const maxHp = PARAMETERS.MIN_MAX_HP;

  return {
    uid: uuidV4(),
    factionType: null,
    /** @type {?{ boardType, coordinate }} */
    placement: null,
    jobId: JOB_IDS.NONE,
    maxHp,
    hp: maxHp,
    attackPower: 0,
    defensePower: 0,
    mattackPower: 0,
    mdefensePower: 0,
  };
};

const getJob = (unit) => {
  return jobs[unit.jobId];
};

const getIconId = (unit) => {
  return getJob(unit).iconId;
};


module.exports = {
  createInitialUnitState,
  getIconId,
};
