const assert = require('power-assert');

const { ACTION_TYPES } = require('../../src/consts');
const reducer = require('../../src/reducers');


describe('reducers/index', () => {
  it('should be set at first', () => {
    const state = reducer(undefined, { type: ACTION_TYPES.NOOP });
    assert('battleSquares' in state);
  });
});
