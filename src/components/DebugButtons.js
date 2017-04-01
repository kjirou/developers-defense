// @flow

/*::
import type { GameProgressType } from '../immutable/constants';
 */

const React = require('react');

const { GAME_PROGRESS_TYPES } = require('../immutable/constants');


/*::
type Props = {
  gameProgressType: GameProgressType,
  handlePauseGameButtonTouchStart: () => void,
  handleResumeGameButtonTouchStart: () => void,
  handleStartGameButtonTouchStart: () => void,
};

export type DebugButtonsProps = Props;
 */

const DebugButtons = ({
  gameProgressType,
  handlePauseGameButtonTouchStart,
  handleResumeGameButtonTouchStart,
  handleStartGameButtonTouchStart,
}/*:Props*/) => {
  const button = {
    [GAME_PROGRESS_TYPES.NOT_STARTED]: () => {
      return <div onTouchStart={ handleStartGameButtonTouchStart }>[ Start ]</div>;
    },
    [GAME_PROGRESS_TYPES.STARTED]: () => {
      return <div onTouchStart={ handlePauseGameButtonTouchStart }>[ Pause ]</div>;
    },
    [GAME_PROGRESS_TYPES.PAUSED]: () => {
      return <div onTouchStart={ handleResumeGameButtonTouchStart }>[ Resume ]</div>;
    },
  }[gameProgressType]();

  return <div className="root__debug-buttons" style={ { margin: '4px 20px' } }>
    { button }
  </div>;
};


module.exports = DebugButtons;
