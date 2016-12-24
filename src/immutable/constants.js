const keymirror = require('keymirror');


const ACTION_TYPES = keymirror({
  ALTER_PROGRESS: null,
  ALTER_TECHNICAL_DEBT: null,
  CLEAR_CURSOR: null,
  EXTEND_BATTLE_BOARD_SQUARE_MATRIX: null,
  NOOP: null,
  TICK: null,
  MOVE_CURSOR: null,
  UPDATE_ALLY: null,
  UPDATE_ALLY_COLLECTION: null,
});

const BOARD_TYPES = keymirror({
  ALLIES_BOARD: null,
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

const PARAMETERS = {
  ALLIES_BOARD_COLUMN_LENGTH: 7,
  ALLIES_BOARD_ROW_LENGTH: 2,
  BATTLE_BOARD_COLUMN_LENGTH: 7,
  BATTLE_BOARD_ROW_LENGTH: 9,
  MAX_MAX_HP: 999,
  MAX_PROGRESS: 100,
  MAX_TECHNICAL_DEBT: 100,
  MIN_MAX_HP: 1,
  MIN_PROGRESS: 0,
  MIN_TECHNICAL_DEBT: 0,
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
