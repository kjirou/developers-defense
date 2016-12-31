const keymirror = require('keymirror');


const ACTION_TYPES = keymirror({
  ALTER_PROGRESS: null,
  ALTER_TECHNICAL_DEBT: null,
  CLEAR_CURSOR: null,
  EXTEND_BATTLE_BOARD_SQUARE_MATRIX: null,
  NOOP: null,
  MOVE_CURSOR: null,
  UPDATE_ALLIES: null,
  UPDATE_ALLY: null,
  UPDATE_ENEMIES: null,
  UPDATE_TICK_ID: null,
});

const BOARD_TYPES = keymirror({
  SORTIE_BOARD: null,
  BATTLE_BOARD: null,
});

const FACTION_TYPES = keymirror({
  ALLY: null,
  ENEMY: null,
});

const LANDFORM_TYPES = keymirror({
  CASTLE: null,
  DESERT: null,
  FOREST: null,
  FORT: null,
  GRASSFIELD: null,
  MOUNTAIN: null,
  RIVER: null,
  ROAD: null,
});

const ticksPerSecond = 25;
const tickInterval = 1000 / ticksPerSecond;
if (Math.ceil(tickInterval) !== tickInterval) {
  throw new Error(`The tick-interval must be an integer`);
}

const PARAMETERS = {
  BATTLE_BOARD_COLUMN_LENGTH: 7,
  BATTLE_BOARD_ROW_LENGTH: 9,
  MAX_MAX_HP: 999,
  MAX_PROGRESS: 100,
  MIN_MAX_HP: 1,
  MIN_PROGRESS: 0,
  SORTIE_BOARD_COLUMN_LENGTH: 7,
  SORTIE_BOARD_ROW_LENGTH: 2,
  TICK_INTERVAL: tickInterval,
  TICKS_PER_SECOND: ticksPerSecond,
};

const STYLES = {
  SQUARE_HEIGHT: 48,
  SQUARE_WIDTH: 48,
};


module.exports = {
  ACTION_TYPES,
  BOARD_TYPES,
  FACTION_TYPES,
  LANDFORM_TYPES,
  STYLES,
  PARAMETERS,
};
