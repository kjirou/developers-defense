// @flow
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

const ACTION_TYPES = {
  CLEAR_CURSOR: 'CLEAR_CURSOR',
  EXTEND_BATTLE_BOARD_SQUARE_MATRIX: 'EXTEND_BATTLE_BOARD_SQUARE_MATRIX',
  EXTEND_GAME_STATUS: 'EXTEND_GAME_STATUS',
  NOOP: 'NOOP',
  MOVE_CURSOR: 'MOVE_CURSOR',
  TICK: 'TICK',
  UPDATE_ALLIES: 'UPDATE_ALLIES',
  UPDATE_ALLY: 'UPDATE_ALLY',
  UPDATE_BULLETS: 'UPDATE_BULLETS',
  UPDATE_ENEMIES: 'UPDATE_ENEMIES',
};
/*::export type ActionType = $Keys<typeof ACTION_TYPES>; */

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

const GAME_PROGRESS_TYPES = {
  PAUSED: 'PAUSED',
  NOT_STARTED: 'NOT_STARTED',
  STARTED: 'STARTED',
};
/*::export type GameProgressType = $Keys<typeof GAME_PROGRESS_TYPES>; */

const LANDFORM_TYPES = {
  CASTLE: 'CASTLE',
  DESERT: 'DESERT',
  FOREST: 'FOREST',
  FORT: 'FORT',
  GRASSFIELD: 'GRASSFIELD',
  MOUNTAIN: 'MOUNTAIN',
  NONE: 'NONE',
  RIVER: 'RIVER',
  ROAD: 'ROAD',
};
/*::export type LandformType = $Keys<typeof LANDFORM_TYPES>; */

// Must sync to styles/variables.sass
const ticksPerSecond = 20;
const tickInterval = 1000 / ticksPerSecond;
if (Math.ceil(tickInterval) !== tickInterval) {
  throw new Error(`The tick-interval must be an integer`);
}
const squareSideLength = 48;

const PARAMETERS = {
  BATTLE_BOARD_COLUMN_LENGTH: 7,
  BATTLE_BOARD_ROW_LENGTH: 9,
  ENEMY_MOVE_SPEED_RATE: 5.0,
  MIN_MAX_HIT_POINTS: 1,
  MAX_MAX_HIT_POINTS: 999,
  NECESSARY_MOVE_POINTS: 100,
  SORTIE_BOARD_COLUMN_LENGTH: 7,
  SORTIE_BOARD_ROW_LENGTH: 2,
  SQUARE_SIDE_LENGTH: squareSideLength,
  TICK_INTERVAL: tickInterval,
  TICKS_PER_SECOND: ticksPerSecond,
};

// Must sync to styles/variables.sass
const STYLES = {
  MAX_ANIMATION_DURATION: 10000,
  // TODO: They are not just styles. Move to the `PARAMETERS`
  SQUARE_HEIGHT: squareSideLength,
  SQUARE_WIDTH: squareSideLength,
  UNIT_STATE_CHANGE_EFFECT_DURATION: 1000
};

const UNIT_STATE_CHANGE_LOG_TYPES = {
  ATTACHING_BUFF: 'ATTACHING_BUFF',
  DAMAGE: 'DAMAGE',
  DETACHING_BUFF: 'DETACHING_BUFF',
  HEALING: 'HEALING',
};
/*::export type UnitStateChangeType = $Keys<typeof UNIT_STATE_CHANGE_LOG_TYPES>; */


module.exports = {
  ACT_AIM_RANGE_TYPES,
  ACT_EFFECT_RANGE_TYPES,
  ACTION_TYPES,
  ANIMATION_DESTINATION_TYPES,
  BOARD_TYPES,
  EFFECT_DIRECTIONS,
  FACTION_TYPES,
  FRIENDSHIP_TYPES,
  GAME_PROGRESS_TYPES,
  LANDFORM_TYPES,
  STYLES,
  UNIT_STATE_CHANGE_LOG_TYPES,
  PARAMETERS,
};
