const { mount } = require('enzyme');
const jsdom = require('jsdom').jsdom;
const assert = require('power-assert');
const React = require('react');

const Unit = require('../../src/components/Unit');


describe('components/Unit', function() {
  beforeEach(function() {
    global.document = jsdom();
    global.window = document.defaultView;
  });

  afterEach(function() {
    delete global.window;
    delete global.document;
  });

  describe('_animateStateChangeEffects', function() {
    beforeEach(function() {
      this.containerDomNode = document.createElement('div');
      this.fakeDomTree = document.createElement('body');
      this.fakeDomTree.appendChild(this.containerDomNode);
    });

    it('should create a html element if damagePoints exists', function(done) {
      const stateChanges = [
        { uid: 'a', damagePoints: 123, healingPoints: null },
      ];
      Unit._animateStateChangeEffects(stateChanges, this.containerDomNode, 50, 0);

      setTimeout(() => {
        const effects = this.containerDomNode.querySelectorAll('.unit-state-change-effect');

        assert.strictEqual(effects.length, 1);

        assert(/123/.test(effects[0].textContent));

        done();
      }, 0)
    });

    it('shoud create two html elements if damagePoints and healingPoints exist', function(done) {
      const stateChanges = [
        { uid: 'a', damagePoints: 123, healingPoints: 456 },
      ];
      Unit._animateStateChangeEffects(stateChanges, this.containerDomNode, 50, 0);

      setTimeout(() => {
        const effects = this.containerDomNode.querySelectorAll('.unit-state-change-effect');

        assert.strictEqual(effects.length, 2);

        assert(/123/.test(effects[0].textContent));
        assert(/456/.test(effects[1].textContent));

        done();
      }, 0)
    });

    // TODO:
    //   以下のテストケース群も必要だが、その前に stateChanges のデータ構造がおかしいので
    //   1 変更 = 1 レコードになるように変更した方が良い
    //
    //   - 複数 stateChanges がある際に連続して作成されること
    //   - 同じ uid の要素が一つでも存在する場合は無視すること
    //   - parentNode が無い場合はなにもしないこと
    //
  });

  describe('constructor', function() {
    it('can be created', () => {
      const wrapper = mount(React.createElement(Unit, { iconId: 'foo', top: 0, left: 0 }));
      assert.strictEqual(wrapper.find('i').length, 1);
    });
  });
});
