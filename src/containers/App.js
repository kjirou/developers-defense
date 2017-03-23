// TODO: Apply Flow

/*::
import type { Store } from 'redux';

import type { AppState } from '../types/states';
 */

const React = require('react');

const Root = require('../components/Root');
const { createRootProps } = require('./connections');


/*::
type Props = {
  store: Store,
};
 */

class App extends React.Component {
  /*::
  props: Props;
  state: Object;
   */

  constructor(props/*:Props*/) {
    super(props);

    this.state = this._createStateFromStore();

    this.props.store.subscribe(() => {
      this.setState(this._createStateFromStore());
    });
  }

  _createStateFromStore() {
    return createRootProps(this.props.store.getState(), this.props.store.dispatch);
  }

  render() {
    return React.createElement(Root, this.state);
  }
}


module.exports = App;
