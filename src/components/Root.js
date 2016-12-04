const React = require('react');
const ReactDOM = require('react-dom');


const STYLES = {
  SQUARE: {
    HEIGHT: 60,
    WIDTH: 60,
  },
};


class Square extends React.Component {
  render() {
    const styles = {
      top: STYLES.SQUARE.HEIGHT * this.props.rowIndex,
      left: STYLES.SQUARE.WIDTH * this.props.columnIndex,
    };

    const text = `[${ this.props.rowIndex }, ${ this.props.columnIndex }]`;
    return <div className="square" style={ styles }>{ text }</div>;
  }
}

class Board extends React.Component {
}

class BattleBoard extends Board {
  _createSquares() {
    return Array.from({ length: this.props.rowLength }).map((notUsed, rowIndex) => {
      return Array.from({ length: this.props.columnLength }).map((notUsed, columnIndex) => {
        return React.createElement(Square, {
          key: `square-${ rowIndex }-${ columnIndex }`,
          rowIndex,
          columnIndex,
        });
      });
    });
  }

  render() {
    return <div className="battle-board">
      { this._createSquares() }
    </div>;
  }
}

class RecruitmentBoard extends Board {
  render() {
    return <div>RecruitmentBoard</div>;
  }
}

class SquareInformation extends React.Component {
  render() {
  }
}

class Root extends React.Component {
  render() {
    return (
      <div className="root">
        <BattleBoard rowLength={ 8 } columnLength={ 5 } />
        <RecruitmentBoard />
      </div>
    );
  }
}

module.exports = Root;
