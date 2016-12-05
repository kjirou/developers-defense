const React = require('react');

const { PARAMETERS, STYLES } = require('../../consts');


class Square extends React.Component {
  render() {
    const styles = {
      top: STYLES.SQUARE_HEIGHT * this.props.rowIndex,
      left: STYLES.SQUARE_WIDTH * this.props.columnIndex,
    };

    const text = `[${ this.props.rowIndex }, ${ this.props.columnIndex }]`;
    return <div className="square" style={ styles }>{ text }</div>;
  }
}

class Board extends React.Component {
  _calculateWidth() {
    return STYLES.SQUARE_WIDTH * this.props.columnLength;
  }

  _calculateHeight() {
    return STYLES.SQUARE_HEIGHT * this.props.rowLength;
  }

  createBaseStyles() {
    return {
      width: this._calculateWidth(),
      height: this._calculateHeight(),
    };
  }

  createSquares() {
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

}
Object.assign(Board, {
  propTypes: {
    rowLength: React.PropTypes.number.isRequired,
    columnLength: React.PropTypes.number.isRequired,
  },
});

class BattleBoard extends Board {
  render() {
    const styles = this.createBaseStyles();
    return <div className="root__battle-board" style={ styles }>
      { this.createSquares() }
    </div>;
  }
}

class RecruitmentBoard extends Board {
  render() {
    const styles = this.createBaseStyles();
    return <div className="root__recruitment-board" style={ styles }>
      { this.createSquares() }
    </div>;
  }
}

class StatusBar extends React.Component {
  render() {
    return <div className="root__status-bar">StatusBar</div>;
  }
}

class SquareMonitor extends React.Component {
  render() {
    return <div className="root__square-monitor">SquareMonitor</div>;
  }
}

class Root extends React.Component {
  render() {
    return (
      <div className="root">
        <StatusBar />
        <BattleBoard
          rowLength={ PARAMETERS.BATTLE_BOARD_ROW_LENGTH }
          columnLength={ PARAMETERS.BATTLE_BOARD_COLUMN_LENGTH }
        />
        <RecruitmentBoard
          rowLength={ PARAMETERS.RECRUITMENT_BOARD_ROW_LENGTH }
          columnLength={ PARAMETERS.RECRUITMENT_BOARD_COLUMN_LENGTH }
        />
        <SquareMonitor />
      </div>
    );
  }
}

module.exports = Root;
