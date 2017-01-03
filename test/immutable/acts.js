const assert = require('power-assert');

const {
  ACT_IDS,
  Act,
  actList,
  acts,
} = require('../../src/immutable/acts');


describe('immutable/acts', () => {
  describe('actList', () => {
    it('should be defined', () => {
      assert(actList.length > 0);
      assert(actList[0].prototype instanceof Act);
    });
  });

  describe('acts', () => {
    it('should be defined', () => {
      const keys = Object.keys(acts);
      assert(keys.length > 0);
      assert(acts[keys[0]].prototype instanceof Act);
    });
  });

  describe('ACT_IDS', () => {
    it('should be defined', () => {
      assert(Object.keys(ACT_IDS).length > 0);
    });
  });

  describe('Sub classes', () => {
    it('should be named correctly', () => {
      assert.strictEqual(acts.MELEE_ATTACK.name, 'MeleeAttackAct');
    });
  });
});
