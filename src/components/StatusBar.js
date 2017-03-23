// @flow

const React = require('react');


/*::
type Props = {
  // Seconds
  gameTime: number,
};

export StatusBarProps = Props;
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
