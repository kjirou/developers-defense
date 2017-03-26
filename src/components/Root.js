// @flow

/*::
import type { BoardProps } from '../components/Board';
import type { DebugButtonsProps } from '../components/DebugButtons';
import type { SquareMatrixProps } from '../components/SquareMatrix';
import type { StatusBarProps } from '../components/StatusBar';
 */


const React = require('react');

const DebugButtons = require('./DebugButtons');
const Board = require('./Board');
const SquareMatrix = require('./SquareMatrix');
const SquareViewer = require('./SquareViewer');
const StatusBar = require('./StatusBar');


/*::
type Props = {
  battleBoard: BoardProps,
  battleBoardSquareMatrix: SquareMatrixProps,
  debugButtons: DebugButtonsProps,
  sortieBoard: BoardProps,
  sortieBoardSquareMatrix: SquareMatrixProps,
  statusBar: StatusBarProps,
};

export type RootProps = Props;
 */

const Root = (props/*:Props*/) => {
  const myProps = {
    className: 'root',
  };

  const statusBar = React.createElement(
    StatusBar,
    Object.assign({}, props.statusBar, {
      key: 'status-bar',
    })
  );

  const battleBoardSquareMatrix = React.createElement(
    SquareMatrix,
    Object.assign({}, props.battleBoardSquareMatrix, {
      key: 'battle-board-square-matrix',
    })
  );

  const battleBoard = React.createElement(
    Board,
    Object.assign({}, props.battleBoard, {
      key: 'battle-board',
      children: battleBoardSquareMatrix,
    })
  );

  const sortieBoardSquareMatrix = React.createElement(
    SquareMatrix,
    Object.assign({}, props.sortieBoardSquareMatrix, {
      key: 'sortie-board-square-matrix',
    })
  );

  const squareViewer = React.createElement(
    SquareViewer,
    Object.assign({}, {}, {
      key: 'square-viewer',
    })
  );

  const sortieBoard = React.createElement(
    Board,
    Object.assign({}, props.sortieBoard, {
      key: 'sortie-board',
      children: sortieBoardSquareMatrix,
    })
  );

  const debugButtons = React.createElement(
    DebugButtons,
    Object.assign({}, props.debugButtons, {
      key: 'debug-buttons',
    })
  );

  return React.createElement(
    'div',
    myProps,
    statusBar,
    battleBoard,
    squareViewer,
    sortieBoard,
    debugButtons
  );
};


module.exports = Root;
