// @flow

/**
 * TODO:
 * - ユニット詳細
 *   - アイコン・名前・バフ状態・味方の場合は加えてアクティブスキル選択x3
 * - 地形詳細
 *   - ユニットが居ないマスを選択している場合
 * - (全体の情報)
 *   - どこも選択していない場合、常に表示する必要がないような、戦闘全体に関わる情報を表示
 */


const React = require('react');

const h = React.createElement;


/*::
type Props = {
};

export type SquareViewerProps = Props;
 */

const SquareViewer = ({}/*:Props*/) => {
  const myProps = {
    className: 'root__square-viewer',
  };

  return h('div', myProps);
};


module.exports = SquareViewer;
