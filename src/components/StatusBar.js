// @flow

/**
 * TODO: 何を表示するのか
 * - 右上にシステムボタンは必須
 * - 他は、ゲームの情報として常に表示が必要なデータを出す、まだわからない
 *   - Wave 数もしくは残りの敵の数などのクリアまでの進行情報
 * - 常に見る必要がないデータ（ステージ名など）は、いっそマス目ビューワーに出してもいい
 */

const React = require('react');


/*::
type Props = {
  // Seconds
  gameTime: number,
};

export type StatusBarProps = Props;
 */

const StatusBar = ({ gameTime }/*:Props*/) => {
  const myProps = {
    className: 'root__status-bar',
  };

  return <div { ...myProps }>
    <ul>
      <li>Time: { gameTime }</li>
    </ul>
  </div>;
};


module.exports = StatusBar;
