const { BOARD_TYPES } = require('../immutable/constants');
const {  } = require('./placement');
const {  } = require('./square-matrix');


const findSquaresFromMatrixes = (placement, ...matrixes) => {
  // TODO: Perhaps, it is better to have a Placement in SquareMatrix or Square
};

/**
 * @throws {Error} Found multiple squares
 * @return {?State~Square}
 */
const findOneSquareFromMatrixes = (placement, ...matrixes) => {
  const squares = findSquaresFromMatrixes(placement, ...matrixes);
  if (squares.length > 1) {
    throw new Error(`There are multiple squares found by the placement of ${ JSON.stringify(placement) }`);
  }
  return squares[0] || null;
};



module.exports = {
  findOneSquareFromMatrixes,
};
