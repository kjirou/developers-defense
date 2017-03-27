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

const SquareMatrix = require('./SquareMatrix');

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

  const singleSquareMatrix = h(SquareMatrix, {
    key: 'single-square-matrix',
    serialSquares: [
      {
        rowIndex: 0,
        columnIndex: 0,
      },
    ],
  });

  const components = [];
  components.push(singleSquareMatrix);

  return h('div', myProps, ...components);
};


module.exports = SquareViewer;
