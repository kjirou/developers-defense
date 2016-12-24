const assert = require('power-assert');

const { ACTION_TYPES } = require('../../src/immutable/constants');
const reducer = require('../../src/reducers');


describe('reducers/index', () => {
  it('should be set at first', () => {
    const state = reducer(undefined, { type: ACTION_TYPES.NOOP });
    assert('alliesBoard' in state);
    assert('allyCollection' in state);
    assert('battleBoard' in state);
    assert('cursor' in state);
  });
});
