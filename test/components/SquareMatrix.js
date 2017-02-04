const { mount, shallow } = require('enzyme');
const assert = require('power-assert');
const React = require('react');

const Square = require('../../src/components/Square');
const SquareMatrix = require('../../src/components/SquareMatrix');
const { createNewSquareMatrixState } = require('../../src/state-models/square-matrix');


describe('components/SquareMatrix', () => {
  const _matrix = createNewSquareMatrixState;

  describe('constructor', () => {
    it('can create element', () => {
      const squareMatrix = _matrix(2, 3);
      const wrapper = shallow(React.createElement(SquareMatrix, { squareMatrix }));
      assert.strictEqual(wrapper.find(Square).length, 6);
    });
  });
});
