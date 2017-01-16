const assert = require('power-assert');

const { baseAct } = require('../../src/immutable/acts');
const {
  ACT_AIM_RANGE_TYPES, ACT_EFFECT_RANGE_TYPES, ACTION_TYPES, BOARD_TYPES, FACTION_TYPES, FRIENDSHIP_TYPES
} = require('../../src/immutable/constants');
const reducer = require('../../src/reducers');
const boardMethods = require('../../src/state-models/board');
const coordinateMethods = require('../../src/state-models/coordinate');
const locationMethods = require('../../src/state-models/location');
const {
  applyEffectToUnits,
  canActorAimActAtTargetedUnit,
  choiceAimedUnit,
  choiceClosestCoordinateUnderTargetedUnit,
  computeTick,
  coordinateToRect,
  coordinateToSquareLocation,
  createReachableRects,
  detectAllCollisionsBetweenRectangleAndCoordinate,
  findOneSquareFromBoardsByPlacement,
  fireBullets,
  judgeAffectableFractionTypes,
  willActorAimActAtUnit,
} = require('../../src/state-models/complex-apis');
const placementMethods = require('../../src/state-models/placement');
const rectangleMethods = require('../../src/state-models/rectangle');
const unitMethods = require('../../src/state-models/unit');


describe('state-models/complex-apis', () => {
  const _createPlacedUnit = (rowIndex, columnIndex) => {
    return Object.assign(unitMethods.createNewUnitState(), {
      placement: Object.assign(placementMethods.createNewPlacementState(), {
        boardType: BOARD_TYPES.BATTLE_BOARD,
        coordinate: coordinateMethods.createNewCoordinateState(rowIndex, columnIndex),
      }),
    });
  };

  const _createPlacedAlly = (rowIndex, columnIndex) => {
    return Object.assign(_createPlacedUnit(rowIndex, columnIndex), {
      factionType: FACTION_TYPES.ALLY,
    });
  };

  const _createLocatedUnit = (y, x) => {
    return Object.assign(unitMethods.createNewUnitState(), {
      location: locationMethods.createNewLocationState(y, x),
    });
  };

  const _createNReachAct = (n, options = {}) => {
    const friendshipType = options.friendshipType || null;

    return Object.assign({}, baseAct, {
      friendshipType,
      aimRange: {
        type: ACT_AIM_RANGE_TYPES.REACHABLE,
        reach: n,
      },
    });
  };


  describe('coordinateToSquareLocation', () => {
    it('can execute correctly', () => {
      assert.deepStrictEqual(
        coordinateToSquareLocation(coordinateMethods.createNewCoordinateState(0, 0)),
        locationMethods.createNewLocationState(0, 0)
      );

      assert.deepStrictEqual(
        coordinateToSquareLocation(coordinateMethods.createNewCoordinateState(1, 2)),
        locationMethods.createNewLocationState(48, 96)
      );
    });
  });

  describe('coordinateToRect', () => {
    it('can execute correctly', () => {
      assert.deepStrictEqual(
        coordinateToRect(coordinateMethods.createNewCoordinateState(0, 0)),
        {
          x: 0,
          y: 0,
          width: 48,
          height: 48,
        }
      );

      assert.deepStrictEqual(
        coordinateToRect(coordinateMethods.createNewCoordinateState(1, 2)),
        {
          x: 96,
          y: 48,
          width: 48,
          height: 48,
        }
      );
    });
  });

  describe('detectAllCollisionsBetweenRectangleAndCoordinate', () => {
    it('can execute correctly', () => {
      //  o | - | -
      // ---+---+---
      //  - | - | -
      // ---+---+---
      //  - | - | -
      assert.deepStrictEqual(
        detectAllCollisionsBetweenRectangleAndCoordinate(
          rectangleMethods.createNewRectangleState({ x: 0, y: 0, width: 48, height: 48 }),
          coordinateMethods.createNewCoordinateState(2, 2)
        ),
        [
          coordinateMethods.createNewCoordinateState(0, 0),
        ]
      );

      //  o | o | -
      // ---+---+---
      //  - | - | -
      // ---+---+---
      //  - | - | -
      assert.deepStrictEqual(
        detectAllCollisionsBetweenRectangleAndCoordinate(
          rectangleMethods.createNewRectangleState({ x: 1, y: 0, width: 48, height: 48 }),
          coordinateMethods.createNewCoordinateState(2, 2)
        ),
        [
          coordinateMethods.createNewCoordinateState(0, 0),
          coordinateMethods.createNewCoordinateState(0, 1),
        ]
      );

      //  - | - | -
      // ---+---+---
      //  - | o | -
      // ---+---+---
      //  - | - | -
      assert.deepStrictEqual(
        detectAllCollisionsBetweenRectangleAndCoordinate(
          rectangleMethods.createNewRectangleState({ x: 48, y: 48, width: 48, height: 48 }),
          coordinateMethods.createNewCoordinateState(2, 2)
        ),
        [
          coordinateMethods.createNewCoordinateState(1, 1),
        ]
      );

      //  - | - | -
      // ---+---+---
      //  - | - | -
      // ---+---+---
      //  - | o | o
      assert.deepStrictEqual(
        detectAllCollisionsBetweenRectangleAndCoordinate(
          rectangleMethods.createNewRectangleState({ x: 95, y: 96, width: 48, height: 48 }),
          coordinateMethods.createNewCoordinateState(2, 2)
        ),
        [
          coordinateMethods.createNewCoordinateState(2, 1),
          coordinateMethods.createNewCoordinateState(2, 2),
        ]
      );

      //  - | - | -
      // ---+---+---
      //  o | o | -
      // ---+---+---
      //  o | o | -
      assert.deepStrictEqual(
        detectAllCollisionsBetweenRectangleAndCoordinate(
          rectangleMethods.createNewRectangleState({ x: 24, y: 72, width: 48, height: 48 }),
          coordinateMethods.createNewCoordinateState(2, 2)
        ),
        [
          coordinateMethods.createNewCoordinateState(1, 0),
          coordinateMethods.createNewCoordinateState(1, 1),
          coordinateMethods.createNewCoordinateState(2, 0),
          coordinateMethods.createNewCoordinateState(2, 1),
        ]
      );

      //  - | - |
      // ---+---+
      //  - | o | x
      // ---+---+
      //      x   x
      assert.deepStrictEqual(
        detectAllCollisionsBetweenRectangleAndCoordinate(
          rectangleMethods.createNewRectangleState({ x: 49, y: 49, width: 48, height: 48 }),
          coordinateMethods.createNewCoordinateState(1, 1)
        ),
        [
          coordinateMethods.createNewCoordinateState(1, 1),
        ]
      );
    });
  });

  describe('choiceClosestCoordinateUnderTargetedUnit', () => {
    //  - | - | -
    // ---+---+---
    //  a | t | -
    // ---+---+---
    //  - | - | -
    it('can choice a coordinate between placed units', () => {
      const actor = _createPlacedUnit(1, 0);
      const target = _createPlacedUnit(1, 1);
      const endPointCoordinate = coordinateMethods.createNewCoordinateState(2, 2);

      assert.deepStrictEqual(
        choiceClosestCoordinateUnderTargetedUnit(actor, target, endPointCoordinate),
        coordinateMethods.createNewCoordinateState(1, 1)
      );
    });

    //  - | - | -
    // ---+---+---
    //  - | - | t
    // ---+---+---
    //  - | - | a
    it('can choice a coordinate between located units', () => {
      const actor = _createLocatedUnit(96, 96);
      const target = _createLocatedUnit(48, 96);
      const endPointCoordinate = coordinateMethods.createNewCoordinateState(2, 2);

      assert.deepStrictEqual(
        choiceClosestCoordinateUnderTargetedUnit(actor, target, endPointCoordinate),
        coordinateMethods.createNewCoordinateState(1, 2)
      );
    });

    //  - t - | -
    // ---+---+---
    //  - | - | -
    // ---+---+---
    //  - | a | -
    it('can choice a coordinate from a unit located on the vertical boundary line', () => {
      const actor = _createPlacedUnit(2, 1);
      const target = _createLocatedUnit(0, 24);
      const endPointCoordinate = coordinateMethods.createNewCoordinateState(2, 2);

      assert.deepStrictEqual(
        choiceClosestCoordinateUnderTargetedUnit(actor, target, endPointCoordinate),
        coordinateMethods.createNewCoordinateState(0, 1)
      );
    });

    //  - | - | -
    // ---+-t-+---
    //  a | - | -
    // ---+---+---
    //  - | - | -
    it('can choice a coordinate from a unit located on the horizontal boundary line', () => {
      const actor = _createLocatedUnit(48, 0);
      const target = _createLocatedUnit(24, 48);
      const endPointCoordinate = coordinateMethods.createNewCoordinateState(2, 2);

      assert.deepStrictEqual(
        choiceClosestCoordinateUnderTargetedUnit(actor, target, endPointCoordinate),
        coordinateMethods.createNewCoordinateState(1, 1)
      );
    });

    //  - a t | -
    // ---+---+---
    //  - | - | -
    // ---+---+---
    //  - | - | -
    it('can choice a coordinate by an actor on the boundary line', () => {
      const actor = _createLocatedUnit(0, 24);
      const target = _createPlacedUnit(0, 1);
      const endPointCoordinate = coordinateMethods.createNewCoordinateState(2, 2);

      assert.deepStrictEqual(
        choiceClosestCoordinateUnderTargetedUnit(actor, target, endPointCoordinate),
        coordinateMethods.createNewCoordinateState(0, 1)
      );
    });
  });

  describe('createReachableRects', () => {
    it('can execute correctly', () => {
      assert.deepStrictEqual(
        createReachableRects(locationMethods.createNewLocationState(0, 0), 0),
        [
          { x: 0, y: 0, width: 48, height: 48 },
        ]
      );

      assert.deepStrictEqual(
        createReachableRects(locationMethods.createNewLocationState(0, 0), 1),
        [
          { x: 0, y: 0, width: 48, height: 48 },
          { x: 0, y: -48, width: 48, height: 48 },
          { x: 48, y: 0, width: 48, height: 48 },
          { x: 0, y: 48, width: 48, height: 48 },
          { x: -48, y: 0, width: 48, height: 48 },
        ]
      );

      assert.deepStrictEqual(
        createReachableRects(locationMethods.createNewLocationState(100, 150), 0),
        [
          { x: 150, y: 100, width: 48, height: 48 },
        ]
      );
    });
  });

  describe('findOneSquareFromBoardsByPlacement', () => {
    let sortieBoard;
    let battleBoard;

    beforeEach(() => {
      sortieBoard = boardMethods.createNewBoardState(BOARD_TYPES.SORTIE_BOARD, 2, 3);
      battleBoard = boardMethods.createNewBoardState(BOARD_TYPES.BATTLE_BOARD, 4, 5);
    });

    it('can find a square from multiple boards by the placement interdisciplinary', () => {
      const s1 = findOneSquareFromBoardsByPlacement(
        Object.assign(placementMethods.createNewPlacementState(), {
          boardType: BOARD_TYPES.SORTIE_BOARD,
          coordinate: [0, 0],
        }),
        sortieBoard,
        battleBoard
      );
      assert.strictEqual(s1, sortieBoard.squareMatrix[0][0]);

      const s2 = findOneSquareFromBoardsByPlacement(
        Object.assign(placementMethods.createNewPlacementState(), {
          boardType: BOARD_TYPES.BATTLE_BOARD,
          coordinate: [3, 4],
        }),
        sortieBoard,
        battleBoard
      );
      assert.strictEqual(s2, battleBoard.squareMatrix[3][4]);
    });

    it('should return a null if the placement is not exist', () => {
      const s1 = findOneSquareFromBoardsByPlacement(
        Object.assign(placementMethods.createNewPlacementState(), {
          boardType: BOARD_TYPES.SORTIE_BOARD,
          coordinate: [0, 3],
        }),
        sortieBoard,
        battleBoard
      );
      assert.strictEqual(s1, null);

      const s2 = findOneSquareFromBoardsByPlacement(
        Object.assign(placementMethods.createNewPlacementState()),
        sortieBoard,
        battleBoard
      );
      assert.strictEqual(s2, null);
    });

    it('should throw a error if it find multiple squares', () => {
      assert.throws(() => {
        findOneSquareFromBoardsByPlacement(
          Object.assign(placementMethods.createNewPlacementState(), {
            boardType: BOARD_TYPES.SORTIE_BOARD,
            coordinate: [0, 0],
          }),
          sortieBoard,
          sortieBoard
        );
      }, /SORTIE_BOARD/);
    });
  });

  describe('judgeAffectableFractionTypes', () => {
    it('can execute correctly', () => {
      assert.deepStrictEqual(
        judgeAffectableFractionTypes(FRIENDSHIP_TYPES.FRIENDLY, FACTION_TYPES.ALLY),
        [ 'ALLY' ]
      );

      assert.deepStrictEqual(
        judgeAffectableFractionTypes(FRIENDSHIP_TYPES.UNFRIENDLY, FACTION_TYPES.ALLY),
        [ 'ENEMY' ]
      );

      assert.deepStrictEqual(
        judgeAffectableFractionTypes(FRIENDSHIP_TYPES.UNFRIENDLY, FACTION_TYPES.ENEMY),
        [ 'ALLY' ]
      );
    });
  });

  describe('willActorAimActAtUnit', () => {
    const friendlyAct = Object.assign({}, baseAct, {
      friendshipType: FRIENDSHIP_TYPES.FRIENDLY,
    });
    const unfriendlyAct = Object.assign({}, baseAct, {
      friendshipType: FRIENDSHIP_TYPES.UNFRIENDLY,
    });

    let ally1;
    let ally2;
    let enemy1;
    let enemy2;

    beforeEach(() => {
      ally1 = unitMethods.createNewAllyState();
      ally2 = unitMethods.createNewAllyState();
      enemy1 = unitMethods.createNewEnemyState();
      enemy2 = unitMethods.createNewEnemyState();
    });

    it('should return true in the case of `ally -(friendly act)-> ally`', () => {
      assert.strictEqual(willActorAimActAtUnit(ally1, friendlyAct, ally2), true);
    });

    it('should return false in the case of `ally -(friendly act)-> enemy`', () => {
      assert.strictEqual(willActorAimActAtUnit(ally1, friendlyAct, enemy1), false);
    });

    it('should return false in the case of `enemy -(friendly act)-> ally`', () => {
      assert.strictEqual(willActorAimActAtUnit(enemy1, friendlyAct, ally1), false);
    });

    it('should return true in the case of `enemy -(friendly act)-> enemy`', () => {
      assert.strictEqual(willActorAimActAtUnit(enemy1, friendlyAct, enemy2), true);
    });

    it('should return false in the case of `ally -(unfriendly act)-> ally`', () => {
      assert.strictEqual(willActorAimActAtUnit(ally1, unfriendlyAct, ally2), false);
    });

    it('should return true in the case of `ally -(unfriendly act)-> enemy`', () => {
      assert.strictEqual(willActorAimActAtUnit(ally1, unfriendlyAct, enemy1), true);
    });

    it('should return true in the case of `enemy -(unfriendly act)-> ally`', () => {
      assert.strictEqual(willActorAimActAtUnit(enemy1, unfriendlyAct, ally1), true);
    });

    it('should return false in the case of `enemy -(unfriendly act)-> enemy`', () => {
      assert.strictEqual(willActorAimActAtUnit(enemy1, unfriendlyAct, enemy2), false);
    });
  });

  describe('canActorAimActAtUnit', () => {
    context('REACHABLE type', () => {
      const ZeroReachAct = _createNReachAct(0);
      const OneReachAct = _createNReachAct(1);
      const TwoReachAct = _createNReachAct(2);

      describe('coordinate base calculation', () => {
        it('can check by 0 reach', () => {
          const actor = _createPlacedUnit(2, 3);

          assert.strictEqual(canActorAimActAtTargetedUnit(actor, ZeroReachAct, _createPlacedUnit(2, 3)), true);

          assert.strictEqual(canActorAimActAtTargetedUnit(actor, ZeroReachAct, _createPlacedUnit(1, 3)), false);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, ZeroReachAct, _createPlacedUnit(3, 3)), false);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, ZeroReachAct, _createPlacedUnit(2, 2)), false);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, ZeroReachAct, _createPlacedUnit(2, 4)), false);
        });

        it('can check by 1 reach', () => {
          const actor = _createPlacedUnit(2, 3);

          assert.strictEqual(canActorAimActAtTargetedUnit(actor, OneReachAct, _createPlacedUnit(2, 3)), true);

          assert.strictEqual(canActorAimActAtTargetedUnit(actor, OneReachAct, _createPlacedUnit(1, 3)), true);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, OneReachAct, _createPlacedUnit(3, 3)), true);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, OneReachAct, _createPlacedUnit(2, 2)), true);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, OneReachAct, _createPlacedUnit(2, 4)), true);

          // [-2, 0], [+2, 0], [0, -2], [0, +2]
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, OneReachAct, _createPlacedUnit(0, 3)), false);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, OneReachAct, _createPlacedUnit(4, 3)), false);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, OneReachAct, _createPlacedUnit(2, 1)), false);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, OneReachAct, _createPlacedUnit(2, 5)), false);

          // [-1, -1], [-1, +1], [+1, -1], [+1, +1]
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, OneReachAct, _createPlacedUnit(1, 2)), false);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, OneReachAct, _createPlacedUnit(1, 4)), false);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, OneReachAct, _createPlacedUnit(3, 2)), false);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, OneReachAct, _createPlacedUnit(3, 4)), false);
        });

        it('can check by 2 reach', () => {
          const actor = _createPlacedUnit(2, 3);

          assert.strictEqual(canActorAimActAtTargetedUnit(actor, TwoReachAct, _createPlacedUnit(2, 3)), true);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, TwoReachAct, _createPlacedUnit(3, 3)), true);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, TwoReachAct, _createPlacedUnit(4, 3)), true);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, TwoReachAct, _createPlacedUnit(5, 3)), false);
        });
      });

      describe('location base calculation', () => {
        it('can check by 0 reach', () => {
          const actor = _createLocatedUnit(100, 150);

          assert.strictEqual(canActorAimActAtTargetedUnit(actor, ZeroReachAct, _createLocatedUnit(100, 150)), true);

          assert.strictEqual(canActorAimActAtTargetedUnit(actor, ZeroReachAct, _createLocatedUnit(53, 150)), true);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, ZeroReachAct, _createLocatedUnit(100, 197)), true);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, ZeroReachAct, _createLocatedUnit(147, 150)), true);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, ZeroReachAct, _createLocatedUnit(100, 103)), true);

          assert.strictEqual(canActorAimActAtTargetedUnit(actor, ZeroReachAct, _createLocatedUnit(52, 150)), false);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, ZeroReachAct, _createLocatedUnit(100, 198)), false);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, ZeroReachAct, _createLocatedUnit(148, 150)), false);
          assert.strictEqual(canActorAimActAtTargetedUnit(actor, ZeroReachAct, _createLocatedUnit(100, 102)), false);
        });
      });
    });
  });

  describe('choiceAimedUnit', () => {
    const ZeroReachAct = _createNReachAct(0, { friendshipType: FRIENDSHIP_TYPES.FRIENDLY });
    const OneReachAct = _createNReachAct(1, { friendshipType: FRIENDSHIP_TYPES.FRIENDLY });
    const TwoReachAct = _createNReachAct(2, { friendshipType: FRIENDSHIP_TYPES.FRIENDLY });

    describe('reach check', () => {
      it('should aim the reach=0 act to same place', () => {
        //
        //  012
        // 0-T-
        // 1TTT
        // 2-T-
        //
        const targets = [
          _createPlacedAlly(0, 1),
          _createPlacedAlly(1, 0),
          _createPlacedAlly(1, 1),
          _createPlacedAlly(1, 2),
          _createPlacedAlly(2, 1),
        ];

        assert.strictEqual(choiceAimedUnit(_createPlacedAlly(1, 1), ZeroReachAct, targets), targets[2]);
        assert.strictEqual(choiceAimedUnit(_createPlacedAlly(2, 2), ZeroReachAct, targets), null);
      });

      it('should aim the reach=1 act to adjacent place', () => {
        //
        //  012
        // 0T--
        // 1---
        // 2--T
        //
        const targets = [
          _createPlacedAlly(0, 0),
          _createPlacedAlly(2, 2),
        ];

        assert.strictEqual(choiceAimedUnit(_createPlacedAlly(0, 1), OneReachAct, targets), targets[0]);
        assert.strictEqual(choiceAimedUnit(_createPlacedAlly(1, 0), OneReachAct, targets), targets[0]);
        assert.strictEqual(choiceAimedUnit(_createPlacedAlly(1, 2), OneReachAct, targets), targets[1]);
        assert.strictEqual(choiceAimedUnit(_createPlacedAlly(2, 1), OneReachAct, targets), targets[1]);
        assert.strictEqual(choiceAimedUnit(_createPlacedAlly(1, 1), OneReachAct, targets), null);
      });

      it('should aim the reach=2 act to distant place', () => {
        //
        //  012
        // 0T--
        // 1---
        // 2---
        //
        const targets = [
          _createPlacedAlly(0, 0),
        ];

        assert.strictEqual(choiceAimedUnit(_createPlacedAlly(0, 2), TwoReachAct, targets), targets[0]);
        assert.strictEqual(choiceAimedUnit(_createPlacedAlly(1, 1), TwoReachAct, targets), targets[0]);
        assert.strictEqual(choiceAimedUnit(_createPlacedAlly(2, 0), TwoReachAct, targets), targets[0]);
        assert.strictEqual(choiceAimedUnit(_createPlacedAlly(1, 2), TwoReachAct, targets), null);
        assert.strictEqual(choiceAimedUnit(_createPlacedAlly(2, 1), TwoReachAct, targets), null);
      });
    });

    describe('closest order', () => {
      it('can execute correctly', () => {
        //
        //  012
        // 0T--
        // 1TT-
        // 2---
        //
        const targets = [
          _createPlacedAlly(0, 0),
          _createPlacedAlly(1, 0),
          _createPlacedAlly(1, 1),
        ];

        assert.strictEqual(choiceAimedUnit(_createPlacedAlly(2, 0), TwoReachAct, targets), targets[1]);
        assert.strictEqual(choiceAimedUnit(_createPlacedAlly(1, 2), TwoReachAct, targets), targets[2]);
      });
    });

    describe('clock-wise order', () => {
      it('should give priority to the top', () => {
        //
        //  012
        // 0-T-
        // 1T-T
        // 2-T-
        //
        const targets = [
          _createPlacedAlly(2, 1),
          _createPlacedAlly(0, 1),
          _createPlacedAlly(1, 2),
          _createPlacedAlly(1, 0),
        ];

        assert.strictEqual(choiceAimedUnit(_createPlacedAlly(1, 1), OneReachAct, targets), targets[1]);
      });

      it('should give priority to the right', () => {
        //
        //  012
        // 0---
        // 1T-T
        // 2-T-
        //
        const targets = [
          _createPlacedAlly(1, 0),
          _createPlacedAlly(2, 1),
          _createPlacedAlly(1, 2),
        ];

        assert.strictEqual(choiceAimedUnit(_createPlacedAlly(1, 1), OneReachAct, targets), targets[2]);
      });

      it('should give priority to the down', () => {
        //
        //  012
        // 0---
        // 1T--
        // 2-T-
        //
        const targets = [
          _createPlacedAlly(2, 1),
          _createPlacedAlly(1, 0),
        ];

        assert.strictEqual(choiceAimedUnit(_createPlacedAlly(1, 1), OneReachAct, targets), targets[0]);
      });
    });
  });

  describe('fireBullets', () => {
    const actTargetingOneUnit = Object.assign({}, baseAct, {
      bullet: {
        speed: 9999,
      },
      effectRange: {
        type: ACT_EFFECT_RANGE_TYPES.UNIT,
      },
    });

    const actTargetingOneSquare = Object.assign({}, baseAct, {
      bullet: {
        speed: 9999,
      },
      effectRange: {
        type: ACT_EFFECT_RANGE_TYPES.BALL,
        radius: 1,
      },
    });

    const endPointCoordinate = coordinateMethods.createNewCoordinateState(10, 10);

    describe('generation of trajectory and speed', () => {
      context('act.effectRange.type is ACT_EFFECT_RANGE_TYPES.UNIT', () => {
        it('can execute correctly', () => {
          const actor = _createPlacedUnit(0, 1);
          const target = _createPlacedUnit(1, 0);
          const [ bullet ] = fireBullets(actor, actTargetingOneUnit, target, endPointCoordinate, { effect: {} });

          assert.deepStrictEqual(bullet.fromLocation, locationMethods.createNewLocationState(24, 72))
          assert.deepStrictEqual(bullet.toLocation, locationMethods.createNewLocationState(72, 24))
          assert.strictEqual(bullet.speed, 9999);
        });
      });

      context('act.effectRange.type is one of others', () => {
        it('can execute correctly', () => {
          const actor = _createPlacedUnit(0, 1);
          const target = _createPlacedUnit(2, 3);
          const [ bullet ] = fireBullets(actor, actTargetingOneSquare, target, endPointCoordinate, { effect: {} });

          assert.deepStrictEqual(bullet.fromLocation, locationMethods.createNewLocationState(24, 72))
          assert.deepStrictEqual(bullet.toLocation, locationMethods.createNewLocationState(120, 168))
          assert.strictEqual(bullet.speed, 9999);
        });
      });
    });

    describe('generation of effect', () => {
    });
  });

  describe('applyEffectToUnits', () => {
    describe('aaa', () => {
      it('aaaaa', () => {
      });
    });
  });

  describe('computeTick', () => {
    let initialState;

    beforeEach(() => {
      initialState = reducer(undefined, { type: ACTION_TYPES.NOOP });
    });

    it('should not throw an error at least', () => {
      const newState = computeTick(initialState);

      assert(Boolean(newState));
      assert.strictEqual(typeof newState, 'object');
    });
  });
});
