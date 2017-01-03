/** @module */
const memoize = require('lodash.memoize');
const S = require('string');


const cloneViaJson = (value) => {
  return JSON.parse(JSON.stringify(value));
};

/**
 * ("abc_def"|"ABC_DEF") -> "AbcDef"
 * @param {string} str
 * @return {string}
 */
const underscoredToClassName = (str) => {
  return S(str.toLowerCase()).titleCase().camelize().s;
};

/**
 * @param {...Array<Array<number>>} matrices
 * @return {boolean}
 */
const areSameSizeMatrices = (...matrices) => {
  const [first, ...rest] = matrices;

  for (let restIndex = 0; restIndex < rest.length; restIndex += 1) {
    const current = rest[restIndex];

    if (first.length !== current.length) return false;

    for (let rowIndex = 0; rowIndex < first.length; rowIndex += 1) {
      if (first[rowIndex].length !== current[rowIndex].length) return false;
    }
  }

  return true;
};

/**
 * @param {...Array<Array<number>>} matrices
 * @return {Array<Array<number>>}
 */
const matrixAdd = (...matrices) => {
  if (!areSameSizeMatrices(matrices)) {
    throw new Error('Matrices are not same size');
  }

  const [first, ...rest] = matrices;
  const result = first.map(row => row.slice());

  for (let restIndex = 0; restIndex < rest.length; restIndex += 1) {
    for (let rowIndex = 0; rowIndex < first.length; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < first[rowIndex].length; columnIndex += 1) {
        result[rowIndex][columnIndex] += rest[restIndex][rowIndex][columnIndex];
      }
    }
  }

  return result;
};

/**
 * 4 -> [[4, 0], [3, 1], [2, 2], [1, 3], [0, 4]]
 * @param {number} n - A integer >= 0
 * @return {Array<Array<number>>}
 * @description It is not "integer partition" of mathematics.
 */
const partitionIntegerToTwoParts = (n) => {
  const parts = [];
  for (let current = 0; current <= n; current += 1) {
    parts.push([n - current, current]);
  }
  return parts;
};

/**
 * @param {number} reach - 0 <= integer < 10000
 * @description It does not work in the case of `reach > 10000`, because the internal logic is not good.
 */
const expandDistanceToRelativeCoordinatesWithoutMemoization = (reach) => {
  const directions = [
    // top-right
    [-1, 1],
    // bottom-right
    [1, 1],
    // bottom-left
    [1, -1],
    // top-left
    [-1, -1],
  ];

  const relativeCoordinates = [];

  partitionIntegerToTwoParts(reach).forEach(part => {
    directions.forEach(direction => {
      const coordinate = [
        part[0] * direction[0],
        part[1] * direction[1],
      ];

      if (
        relativeCoordinates.some(c => c[0] === coordinate[0] && c[1] === coordinate[1]) === false
      ) {
        relativeCoordinates.push(coordinate);
      }
    });
  });

  const calculatePriority = (relativeCoordinate) => {
    const [rowIndexDelta, columnIndexDelta] = relativeCoordinate;

    // top
    if (rowIndexDelta < 0 && columnIndexDelta === 0) {
      return 80000;
    // top-right
    } else if (rowIndexDelta < 0 && columnIndexDelta > 0) {
      return 70000 - rowIndexDelta;
    // right
    } else if (rowIndexDelta === 0 && columnIndexDelta > 0) {
      return 60000;
    // bottom-right
    } else if (rowIndexDelta > 0 && columnIndexDelta > 0) {
      return 50000 + columnIndexDelta;
    // bottom
    } else if (rowIndexDelta > 0 && columnIndexDelta === 0) {
      return 40000;
    // bottom-left
    } else if (rowIndexDelta > 0 && columnIndexDelta < 0) {
      return 30000 + rowIndexDelta;
    // left
    } else if (rowIndexDelta === 0 && columnIndexDelta < 0) {
      return 20000;
    // top-left
    } else if (rowIndexDelta < 0 && columnIndexDelta < 0) {
      return 10000 - columnIndexDelta;
    } else {
      throw new Error(`Unexpected situation`);
    }
  };

  // Make the order clockwise
  return relativeCoordinates.sort((a, b) => {
    const ap = calculatePriority(a);
    const bp = calculatePriority(b);

    if (ap > bp) {
      return -1;
    } else if (ap < bp) {
      return 1;
    } else {
      return 0;
    }
  });
};

const expandDistanceToRelativeCoordinates = memoize(expandDistanceToRelativeCoordinatesWithoutMemoization);

const expandReachToRelativeCoordinates = (minReach, maxReach) => {
  let coordinates = [];

  for (let current = minReach; current <= maxReach; current += 1) {
    coordinates = coordinates.concat(expandDistanceToRelativeCoordinates(current));
  }

  return coordinates;
};


module.exports = {
  _expandDistanceToRelativeCoordinatesWithoutMemoization: expandDistanceToRelativeCoordinatesWithoutMemoization,
  _expandDistanceToRelativeCoordinates: expandDistanceToRelativeCoordinates,
  _partitionIntegerToTwoParts: partitionIntegerToTwoParts,
  areSameSizeMatrices,
  cloneViaJson,
  expandReachToRelativeCoordinates,
  matrixAdd,
  underscoredToClassName,
};
