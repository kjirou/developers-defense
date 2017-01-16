const assert = require('power-assert');

const {
  JOB_IDS,
  jobList,
  jobs,
} = require('../../src/immutable/jobs');


describe('immutable/jobs', () => {
  describe('jobList', () => {
    it('should be defined', () => {
      assert(jobList.length > 0);
      assert(jobList[0].id.length > 0);
    });
  });

  describe('jobs', () => {
    it('should be defined', () => {
      const keys = Object.keys(jobs);
      assert(keys.length > 0);
      assert(jobs[keys[0]].id.length > 0);
    });
  });

  describe('JOB_IDS', () => {
    it('should be defined', () => {
      assert(Object.keys(JOB_IDS).length > 0);
    });
  });
});
