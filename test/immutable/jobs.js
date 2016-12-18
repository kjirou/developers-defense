const assert = require('power-assert');

const {
  JOB_IDS,
  Job,
  jobList,
  jobs,
} = require('../../src/immutable/jobs');


describe('immutable/jobs', () => {
  describe('Job', () => {
  });

  describe('jobList', () => {
    it('should be defined', () => {
      assert(jobList.length > 0);
      assert(jobList[0].prototype instanceof Job);
    });
  });

  describe('jobs', () => {
    it('should be defined', () => {
      const keys = Object.keys(jobs);
      assert(keys.length > 0);
      assert(jobs[keys[0]].prototype instanceof Job);
    });
  });

  describe('JOB_IDS', () => {
    it('should be defined', () => {
      assert(Object.keys(JOB_IDS).length > 0);
    });
  });

  describe('Sub classes', () => {
    it('should be named correctly', () => {
      assert.strictEqual(jobs.NONE.name, 'NoneJob');
    });
  });
});
