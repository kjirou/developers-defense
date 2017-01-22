const assert = require('power-assert');

const {
  createNewEffectLogState,
} = require('../../src/state-models/effect-log');


describe('state-models/rectangle', () => {
  describe('createNewEffectLogState', () => {
    it('can execute correctly', () => {
      const empty = createNewEffectLogState('a');
      assert.strictEqual(empty.unitUid, 'a');
      assert.strictEqual(empty.damagePoints, null);
      assert.strictEqual(empty.healingPoints, null);

      const notEmpty = createNewEffectLogState('b', {damagePoints: 1, healingPoints: 2 });
      assert.strictEqual(notEmpty.unitUid, 'b');
      assert.strictEqual(notEmpty.damagePoints, 1);
      assert.strictEqual(notEmpty.healingPoints, 2);
    });
  });
});
