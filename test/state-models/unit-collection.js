const assert = require('power-assert');

const { createNewUnitState } = require('../../src/state-models/unit');
const {
  createNewUnitCollectionState,
  findUnitByUid,
} = require('../../src/state-models/unit-collection');


describe('state-models/unit-collection', () => {
  describe('findUnitByUid', () => {
    it('should be executed correctly', () => {
      const collection = createNewUnitCollectionState();
      collection.push(createNewUnitState());
      collection.push(createNewUnitState());

      assert.strictEqual(findUnitByUid(collection, collection[0].uid), collection[0]);
      assert.strictEqual(findUnitByUid(collection, collection[1].uid), collection[1]);
      assert.strictEqual(findUnitByUid(collection, 'uin_does_not_exist'), null);
    });
  });
});
