// @flow
const keymirror = require('keymirror');


const ACT_AIM_RANGE_TYPES = {
  CONE: 'CONE',
  LINE: 'LINE',
  REACHABLE: 'REACHABLE',
  SLANTING_LINE: 'SLANTING_LINE',
};
/*::export type ActAimRangeType = $Keys<typeof ACT_AIM_RANGE_TYPES>; */

const ACT_EFFECT_RANGE_TYPES = {
  BALL: 'BALL',
  CONE: 'CONE',
  LINE: 'LINE',
  SLANTING_LINE: 'SLANTING_LINE',
  UNIT: 'UNIT',
};
/*::export type ActEffectRangeType = $Keys<typeof ACT_EFFECT_RANGE_TYPES>; */

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
/*::export type AnimationDestinationType = $Keys<typeof ANIMATION_DESTINATION_TYPES>; */

const BOARD_TYPES = {
  SORTIE_BOARD: 'SORTIE_BOARD',
  BATTLE_BOARD: 'BATTLE_BOARD',
};
/*::export type BoardType = $Keys<typeof BOARD_TYPES>; */

const EFFECT_DIRECTIONS = {
  UP: 'UP',
  LEFT: 'LEFT',
  DOWN: 'DOWN',
  RIGHT: 'RIGHT',
  NONE: 'NONE',
};

const FACTION_TYPES = {
  ALLY: 'ALLY',
  ENEMY: 'ENEMY',
  NONE: 'NONE',
};
/*::export type FactionType = $Keys<typeof FACTION_TYPES>; */

const FRIENDSHIP_TYPES = {
  FRIENDLY: 'FRIENDLY',
  UNFRIENDLY: 'UNFRIENDLY',
};
/*::export type FriendshipType = $Keys<typeof FRIENDSHIP_TYPES>; */

const LANDFORM_TYPES = {
  CASTLE: 'CASTLE',
  DESERT: 'DESERT',
  FOREST: 'FOREST',
  FORT: 'FORT',
  GRASSFIELD: 'GRASSFIELD',
  MOUNTAIN: 'MOUNTAIN',
  RIVER: 'RIVER',
  ROAD: 'ROAD',
};
/*::export type LandformType = $Keys<typeof LANDFORM_TYPES>; */

// Must sync to styles
const ticksPerSecond = 20;
const tickInterval = 1000 / ticksPerSecond;
if (Math.ceil(tickInterval) !== tickInterval) {
  throw new Error(`The tick-interval must be an integer`);
}
const squareSideLength = 48;

const PARAMETERS = {
  BATTLE_BOARD_COLUMN_LENGTH: 7,
  BATTLE_BOARD_ROW_LENGTH: 9,
  MIN_MAX_HIT_POINTS: 1,
  MAX_MAX_HIT_POINTS: 999,
  MAX_PROGRESS: 100,
  MIN_PROGRESS: 0,
  NECESSARY_MOVE_POINTS: 100,
  SORTIE_BOARD_COLUMN_LENGTH: 7,
  SORTIE_BOARD_ROW_LENGTH: 2,
  SQUARE_SIDE_LENGTH: squareSideLength,
  TICK_INTERVAL: tickInterval,
  TICKS_PER_SECOND: ticksPerSecond,
};

const STYLES = {
  MAX_ANIMATION_DURATION: 10000,
  // TODO: They are not just styles. Move to the `PARAMETERS`
  SQUARE_HEIGHT: squareSideLength,
  SQUARE_WIDTH: squareSideLength,
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
