const { mount } = require('enzyme');
const jsdom = require('jsdom').jsdom;
const assert = require('power-assert');
const React = require('react');

const Unit = require('../../src/components/Unit');
const { UNIT_STATE_CHANGE_LOG_TYPES } = require('../../src/constants');
const { createNewUnitStateChangeLogState } = require('../../src/state-models/unit-state-change-log');


describe('components/Unit', function() {
  beforeEach(function() {
    global.document = jsdom();
    global.window = document.defaultView;
  });

  afterEach(function() {
    delete global.window;
    delete global.document;
  });

  describe('_runAnimations', function() {
    beforeEach(function() {
      this.containerDomNode = document.createElement('div');
    });

    it('should create an element into the container from one animation props', function(done) {
      const animationPropsList = [
        {
          uid: 'a',
          classNames: ['foo'],
          duration: 10,
        },
      ];
      Unit._runAnimations(animationPropsList, this.containerDomNode);

      setTimeout(() => {
        const animatedNodes = this.containerDomNode.querySelectorAll('.foo');

        assert.strictEqual(animatedNodes.length, 1);

        done();
      }, 0)
    });

    it('should create elements into the container from two animation props list', function(done) {
      const animationPropsList = [
        {
          uid: 'a',
          classNames: ['foo'],
          duration: 10,
        },
        {
          uid: 'b',
          classNames: ['foo'],
          duration: 10,
        },
      ];
      Unit._runAnimations(animationPropsList, this.containerDomNode);

      setTimeout(() => {
        const animatedNodes = this.containerDomNode.querySelectorAll('.foo');

        assert.strictEqual(animatedNodes.length, 2);

        done();
      }, 0)
    });

    it('can prevent duplication of rendering with `uid`', function(done) {
      const animationPropsList = [
        {
          uid: 'a',
          classNames: ['foo'],
          duration: 10,
        },
      ];
      Unit._runAnimations(animationPropsList, this.containerDomNode);
      Unit._runAnimations(animationPropsList, this.containerDomNode);

      setTimeout(() => {
        const animatedNodes = this.containerDomNode.querySelectorAll('.foo');

        assert.strictEqual(animatedNodes.length, 1);

        done();
      }, 0)
    });
  });

  describe('_animateStateChangeEffects', function() {
    beforeEach(function() {
      this.containerDomNode = document.createElement('div');
    });

    it('should create an element into the container from one log', function(done) {
      const logs = [
        createNewUnitStateChangeLogState('uid', 1, UNIT_STATE_CHANGE_LOG_TYPES.DAMAGE, 123),
      ];
      Unit._animateStateChangeEffects(logs, this.containerDomNode, 50, 0);

      setTimeout(() => {
        const effects = this.containerDomNode.querySelectorAll('.unit-state-change-effect');

        assert.strictEqual(effects.length, 1);

        assert(/123/.test(effects[0].textContent));

        done();
      }, 0)
    });

    it('should create elements into the container from plural logs', function(done) {
      const logs = [
        createNewUnitStateChangeLogState('uid1', 1, UNIT_STATE_CHANGE_LOG_TYPES.DAMAGE, 123),
        createNewUnitStateChangeLogState('uid2', 1, UNIT_STATE_CHANGE_LOG_TYPES.HEALING, 456),
      ];
      Unit._animateStateChangeEffects(logs, this.containerDomNode, 50, 0);

      setTimeout(() => {
        const effects = this.containerDomNode.querySelectorAll('.unit-state-change-effect');

        assert.strictEqual(effects.length, 2);

        assert(/123/.test(effects[0].textContent));
        assert(/456/.test(effects[1].textContent));

        done();
      }, 0)
    });

    it('should remove the created element after `effectDuration`', function(done) {
      const logs = [
        createNewUnitStateChangeLogState('uid', 1, UNIT_STATE_CHANGE_LOG_TYPES.DAMAGE, 123),
      ];
      Unit._animateStateChangeEffects(logs, this.containerDomNode, 0, 0);

      setTimeout(() => {
        const effects = this.containerDomNode.querySelectorAll('.unit-state-change-effect');

        assert.strictEqual(effects.length, 0);

        done();
      }, 10)
    });

    it('can prevent duplication of rendering with `uid`', function() {
      const logs = [
        createNewUnitStateChangeLogState('uid', 1, UNIT_STATE_CHANGE_LOG_TYPES.DAMAGE, 123),
      ];

      return Promise.resolve()
        .then(() => {
          Unit._animateStateChangeEffects(logs, this.containerDomNode, 50, 0);
        })
        .then(() => new Promise(resolve => setTimeout(resolve, 5)))
        .then(() => {
          const effects = this.containerDomNode.querySelectorAll('.unit-state-change-effect');
          assert.strictEqual(effects.length, 1);

          Unit._animateStateChangeEffects(logs, this.containerDomNode, 50, 0);
        })
        .then(() => new Promise(resolve => setTimeout(resolve, 5)))
        .then(() => {
          const effects = this.containerDomNode.querySelectorAll('.unit-state-change-effect');
          assert.strictEqual(effects.length, 1);
        })
      ;
    });
  });

  describe('constructor', function() {
    it('can be created', () => {
      const wrapper = mount(React.createElement(Unit, { iconId: 'foo', top: 0, left: 0 }));
      assert.strictEqual(wrapper.find('i').length, 1);
    });
  });
});
