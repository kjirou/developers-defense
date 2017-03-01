// @flow
const keymirror = require('keymirror');


const ACT_AIM_RANGE_TYPES = {
  CONE: 'CONE',
  LINE: 'LINE',
  REACHABLE: 'REACHABLE',
  SLANTING_LINE: 'SLANTING_LINE',
};

const ACT_EFFECT_RANGE_TYPES = {
  BALL: 'BALL',
  CONE: 'CONE',
  LINE: 'LINE',
  SLANTING_LINE: 'SLANTING_LINE',
  UNIT: 'UNIT',
};

const ACTION_TYPES = keymirror({
  ALTER_PROGRESS: null,
  CLEAR_CURSOR: null,
  EXTEND_BATTLE_BOARD_SQUARE_MATRIX: null,
  EXTEND_GAME_STATUS: null,
  NOOP: null,
  MOVE_CURSOR: null,
  TICK: null,
  UPDATE_ALLIES: null,
  UPDATE_ALLY: null,
  UPDATE_BULLETS: null,
  UPDATE_ENEMIES: null,
});

const ANIMATION_DESTINATION_TYPES = {
  NONE: 'NONE',
  SQUARE: 'SQUARE',
  UNIT: 'UNIT',
};

const BOARD_TYPES = keymirror({
  SORTIE_BOARD: null,
  BATTLE_BOARD: null,
});

const EFFECT_DIRECTIONS = {
  UP: 'UP',
  LEFT: 'LEFT',
  DOWN: 'DOWN',
  RIGHT: 'RIGHT',
  NONE: 'NONE',
};

const FACTION_TYPES = keymirror({
  ALLY: null,
  ENEMY: null,
  NONE: null,
});

const FRIENDSHIP_TYPES = keymirror({
  FRIENDLY: null,
  UNFRIENDLY: null,
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

// Must sync to styles
const ticksPerSecond = 20;
const tickInterval = 1000 / ticksPerSecond;
if (Math.ceil(tickInterval) !== tickInterval) {
  throw new Error(`The tick-interval must be an integer`);
}

const PARAMETERS = {
  BATTLE_BOARD_COLUMN_LENGTH: 7,
  BATTLE_BOARD_ROW_LENGTH: 9,
  MIN_MAX_HIT_POINTS: 1,
  MAX_MAX_HIT_POINTS: 999,
  MAX_PROGRESS: 100,
  MIN_PROGRESS: 0,
  SORTIE_BOARD_COLUMN_LENGTH: 7,
  SORTIE_BOARD_ROW_LENGTH: 2,
  TICK_INTERVAL: tickInterval,
  TICKS_PER_SECOND: ticksPerSecond,
};

const STYLES = {
  MAX_ANIMATION_DURATION: 10000,
  // TODO: They are not just styles. Move to the `PARAMETERS`
  SQUARE_HEIGHT: 48,
  SQUARE_WIDTH: 48,
};


module.exports = {
  ACT_AIM_RANGE_TYPES,
  ACT_EFFECT_RANGE_TYPES,
  ACTION_TYPES,
  ANIMATION_DESTINATION_TYPES,
  BOARD_TYPES,
  EFFECT_DIRECTIONS,
  FACTION_TYPES,
  FRIENDSHIP_TYPES,
  LANDFORM_TYPES,
  STYLES,
  PARAMETERS,
};
