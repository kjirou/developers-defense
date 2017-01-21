const assert = require('power-assert');

const {
  createNewEffectLogState,
} = require('../../src/state-models/effect-log');


describe('state-models/rectangle', () => {
  describe('createNewEffectLogState', () => {
    it('can execute correctly', () => {
      const empty = createNewEffectLogState();
      assert.strictEqual(empty.unitUid, null);
      assert.strictEqual(empty.damagePoints, null);
      assert.strictEqual(empty.healingPoints, null);

      const notEmpty = createNewEffectLogState({ unitUid: 'a', damagePoints: 1, healingPoints: 2 });
      assert.strictEqual(notEmpty.unitUid, 'a');
      assert.strictEqual(notEmpty.damagePoints, 1);
      assert.strictEqual(notEmpty.healingPoints, 2);
    });
  });
});
