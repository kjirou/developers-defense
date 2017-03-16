const assert = require('power-assert');

const { ACTION_TYPES } = require('../../src/immutable/constants');
const reducer = require('../../src/reducers');


describe('reducers/index', () => {
  it('should be set at first', () => {
    const state = reducer(undefined, { type: ACTION_TYPES.NOOP });
    assert('allies' in state);
    assert('battleBoard' in state);
    assert('bullets' in state);
    assert('cursor' in state);
    assert('effectLogs' in state);
    assert('enemies' in state);
    assert('sortieBoard' in state);
  });
});
