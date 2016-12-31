const React = require('react');
const { connect } = require('react-redux');

const { startGame } = require('../actions');


let DebugButtons = ({ dispatch, gameStatus }) => {
  const handleStartGameButtonTouchStart = () => {
    dispatch(startGame());
  };

  return <div className="root__debug-buttons" style={ { margin: '10px 20px' } }>
    {
      gameStatus.tickId === null ? <div onTouchStart={ handleStartGameButtonTouchStart }>[Start Game]</div> : null
    }
  </div>;
};

DebugButtons = connect(state => state)(DebugButtons);


module.exports = DebugButtons;
