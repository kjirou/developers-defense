const assert = require('power-assert');

const { BOARD_TYPES } = require('../../src/immutable/constants');
const { createNewBoardState } = require('../../src/state-models/board');
const {
  findOneSquareFromBoardsByPlacement,
} = require('../../src/state-models/complex-apis');
const { createNewPlacementState } = require('../../src/state-models/placement');

describe('state-models/complex-apis', () => {
  describe('findOneSquareFromBoardsByPlacement', () => {
    let alliesBoard;
    let battleBoard;

    beforeEach(() => {
      alliesBoard = createNewBoardState(BOARD_TYPES.ALLIES_BOARD, 2, 3);
      battleBoard = createNewBoardState(BOARD_TYPES.BATTLE_BOARD, 4, 5);
    });

    it('can find a square from multiple boards by the placement interdisciplinary', () => {
      const s1 = findOneSquareFromBoardsByPlacement(
        Object.assign(createNewPlacementState(), {
          boardType: BOARD_TYPES.ALLIES_BOARD,
          coordinate: [0, 0],
        }),
        alliesBoard,
        battleBoard
      );
      assert.strictEqual(s1, alliesBoard.squareMatrix[0][0]);

      const s2 = findOneSquareFromBoardsByPlacement(
        Object.assign(createNewPlacementState(), {
          boardType: BOARD_TYPES.BATTLE_BOARD,
          coordinate: [3, 4],
        }),
        alliesBoard,
        battleBoard
      );
      assert.strictEqual(s2, battleBoard.squareMatrix[3][4]);
    });

    it('should return a null if the placement is not exist', () => {
      const s1 = findOneSquareFromBoardsByPlacement(
        Object.assign(createNewPlacementState(), {
          boardType: BOARD_TYPES.ALLIES_BOARD,
          coordinate: [0, 3],
        }),
        alliesBoard,
        battleBoard
      );
      assert.strictEqual(s1, null);

      const s2 = findOneSquareFromBoardsByPlacement(
        Object.assign(createNewPlacementState()),
        alliesBoard,
        battleBoard
      );
      assert.strictEqual(s2, null);
    });

    it('should throw a error if it find multiple squares', () => {
      assert.throws(() => {
        findOneSquareFromBoardsByPlacement(
          Object.assign(createNewPlacementState(), {
            boardType: BOARD_TYPES.ALLIES_BOARD,
            coordinate: [0, 0],
          }),
          alliesBoard,
          alliesBoard
        );
      }, /ALLIES_BOARD/);
    });
  });
});
