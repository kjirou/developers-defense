// @flow

const React = require('react');
const { connect } = require('react-redux');

const { extendGameStatus, startGame } = require('../actions');


let DebugButtons = ({ dispatch, gameStatus }) => {
  const handleStartGameButtonTouchStart = () => {
    dispatch(startGame());
  };

  const handlePauseGameButtonTouchStart = () => {
    dispatch(extendGameStatus({ isPaused: true }));
  };

  const handleResumeGameButtonTouchStart = () => {
    dispatch(extendGameStatus({ isPaused: false }));
  };


  const startGameButton = gameStatus.tickId === null ?
    <div onTouchStart={ handleStartGameButtonTouchStart }>[ Start ]</div> : null;

  const pauseGameButton = gameStatus.tickId !== null && !gameStatus.isPaused ?
    <div onTouchStart={ handlePauseGameButtonTouchStart }>[ Pause ]</div> : null;

  const resumeGameButton = gameStatus.tickId !== null && gameStatus.isPaused ?
    <div onTouchStart={ handleResumeGameButtonTouchStart }>[ Resume ]</div> : null;


  return <div className="root__debug-buttons" style={ { margin: '10px 20px' } }>
    { startGameButton }
    { pauseGameButton }
    { resumeGameButton }
  </div>;
};

DebugButtons = connect(state => state)(DebugButtons);


module.exports = DebugButtons;
