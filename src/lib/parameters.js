// @flow

const rpgparameter = require('rpgparameter');

const { PARAMETERS } = require('../constants');


const maxHitPoints = rpgparameter.createIntegerParameterShape({
  min: PARAMETERS.MIN_MAX_HIT_POINTS,
  max: PARAMETERS.MAX_MAX_HIT_POINTS,
  defaultValue: PARAMETERS.MIN_MAX_HIT_POINTS,
});


module.exports = {
  maxHitPoints,
};
