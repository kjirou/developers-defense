const { createInitialSquareState } = require('./square');


const createInitialSquareMatrixState = (rowLength, columnLength) => {
  return Array.from({ length: rowLength }).map((notUsed, rowIndex) => {
    return Array.from({ length: columnLength }).map((notUsed, columnIndex) => {
      return createInitialSquareState(rowIndex, columnIndex);
    });
  });
};


module.exports = {
  createInitialSquareMatrixState,
};
