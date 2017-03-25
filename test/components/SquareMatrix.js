const { mount } = require('enzyme');
const jsdom = require('jsdom').jsdom;
const assert = require('power-assert');
const React = require('react');
const sinon = require('sinon');

const Square = require('../../src/components/Square');
const SquareMatrix = require('../../src/components/SquareMatrix');
const { _createSerialSquarePropsList } = require('../../src/containers/connections');
const { createNewSquareMatrixState } = require('../../src/state-models/square-matrix');


describe('components/SquareMatrix', () => {
  const _matrix = createNewSquareMatrixState;

  beforeEach(() => {
    global.document = jsdom();
    global.window = document.defaultView;
  });

  afterEach(() => {
    delete global.window;
    delete global.document;
  });

  describe('constructor', () => {
    it('can create element', () => {
      const squareMatrix = _matrix(2, 3);
      const wrapper = mount(React.createElement(SquareMatrix, {
        serialSquares: _createSerialSquarePropsList(squareMatrix),
        squareMatrix,
      }));
      assert.strictEqual(wrapper.find(Square).length, 6);
    });
  });

  describe('handleTouchStartPad', done => {
    let mocks;

    beforeEach(() => {
      mocks = [];
    });

    afterEach(() => {
      mocks.forEach(mock => mock.restore());
    });

    it('should be emitted on "touchstart"', done => {
      const mock = sinon.stub(SquareMatrix, '_normalizeTouchPositions', () => {
        return {};
      });
      mocks.push(mock);

      const squareMatrix = _matrix(2, 3);
      const handleTouchStartPad = () => {
        done();
      };

      const wrapper = mount(React.createElement(SquareMatrix, {
        handleTouchStartPad,
        serialSquares: _createSerialSquarePropsList(squareMatrix),
        squareMatrix,
      }));
      const touchpadWrapper = wrapper.find('.square-matrix__touchpad');

      assert.strictEqual(touchpadWrapper.length, 1);

      touchpadWrapper.simulate('touchstart');
    });
  });
});
