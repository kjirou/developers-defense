const { mount } = require('enzyme');
const jsdom = require('jsdom').jsdom;
const assert = require('power-assert');
const React = require('react');

const { createRootProps } = require('../../src/containers/connections');
const { ACTION_TYPES } = require('../../src/constants');
const reducer =  require('../../src/reducers');


describe('containers/connections', function() {
  if (!process.env.DD_TEST_WITH_JSX_INCLUDED) {
    return;
  }

  const Root = require('../../src/components/Root');

  describe('createRootProps', function() {
    beforeEach(function() {
      global.document = jsdom();
      global.window = document.defaultView;
    });

    afterEach(function() {
      delete global.window;
      delete global.document;
    });

    it('can create a props for Root component from the single state', function() {
      const state = reducer(undefined, { type: ACTION_TYPES.NOOP });
      const props = createRootProps(state, () => {});

      mount(React.createElement(Root, props));  // Check only that it is not an error
    });
  });
});
