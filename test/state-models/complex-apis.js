const assert = require('power-assert');

const { baseAct } = require('../../src/immutable/acts');
const {
  ACT_AIM_RANGE_TYPES, ACT_EFFECT_RANGE_TYPES, ACTION_TYPES, BOARD_TYPES,
  FACTION_TYPES, FRIENDSHIP_TYPES,
} = require('../../src/constants');
const reducer = require('../../src/reducers');
const boardMethods = require('../../src/state-models/board');
const coordinateMethods = require('../../src/state-models/coordinate');
const effectMethods = require('../../src/state-models/effect');
const locationMethods = require('../../src/state-models/location');
const {
  _applyEffectToUnit,
  _choiceAimedUnit,
  _choiceClosestCoordinateUnderTargetedUnit,
  _effectOccurs,
  canActorAimActAtTargetedUnit,
  computeTick,
  findOneSquareFromBoardsByPlacement,
  fireBullets,
  judgeAffectableFractionTypes,
  willActorAimActAtUnit,
} = require('../../src/state-models/complex-apis');
const placementMethods = require('../../src/state-models/placement');
const rectangleMethods = require('../../src/state-models/rectangle');
const unitMethods = require('../../src/state-models/unit');


describe('state-models/complex-apis', function() {
  const _coord = coordinateMethods.createNewCoordinateState;
  const _loc = locationMethods.createNewLocationState;
  const _effect = effectMethods.createNewEffectState;
  const _place = placementMethods.createNewPlacementState;
  const _rect = rectangleMethods.createNewRectangleState;
  const _unit = unitMethods.createNewUnitState;

  const _createPlacedUnit = (rowIndex, columnIndex) => {
    return Object.assign(_unit(), {
      placement: _place(BOARD_TYPES.BATTLE_BOARD, _coord(rowIndex, columnIndex)),
    });
  };

  const _createPlacedAlly = (rowIndex, columnIndex) => {
    return Object.assign(_createPlacedUnit(rowIndex, columnIndex), {
      factionType: FACTION_TYPES.ALLY,
    });
  };

  const _createLocatedUnit = (y, x) => {
    return Object.assign(_unit(), {
      location: _loc(y, x),
    });
  };

  const _createLocatedEnemy = (y, x) => {
    return Object.assign(_createLocatedUnit(y, x), {
      factionType: FACTION_TYPES.ENEMY,
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

  const _createEffectTemplate = () => {
    return effectMethods.createNewEffectState([], _loc(0, 0), {
      relativeCoordinates: [0, 0],
    });
  };


  describe('_choiceClosestCoordinateUnderTargetedUnit', () => {
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
        _choiceClosestCoordinateUnderTargetedUnit(actor, target, endPointCoordinate),
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
        _choiceClosestCoordinateUnderTargetedUnit(actor, target, endPointCoordinate),
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
        _choiceClosestCoordinateUnderTargetedUnit(actor, target, endPointCoordinate),
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
        _choiceClosestCoordinateUnderTargetedUnit(actor, target, endPointCoordinate),
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
        _choiceClosestCoordinateUnderTargetedUnit(actor, target, endPointCoordinate),
        coordinateMethods.createNewCoordinateState(0, 1)
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
        _place(BOARD_TYPES.SORTIE_BOARD, _coord(0, 0)),
        sortieBoard,
        battleBoard
      );
      assert.strictEqual(s1, sortieBoard.squareMatrix[0][0]);

      const s2 = findOneSquareFromBoardsByPlacement(
        _place(BOARD_TYPES.BATTLE_BOARD, _coord(3, 4)),
        sortieBoard,
        battleBoard
      );
      assert.strictEqual(s2, battleBoard.squareMatrix[3][4]);
    });

    it('should return a null if the placement is not exist', () => {
      const s1 = findOneSquareFromBoardsByPlacement(
        _place(BOARD_TYPES.SORTIE_BOARD, _coord(0, 3)),
        sortieBoard,
        battleBoard
      );
      assert.strictEqual(s1, null);
    });

    it('should throw a error if it find multiple squares', () => {
      assert.throws(() => {
        findOneSquareFromBoardsByPlacement(
          _place(BOARD_TYPES.SORTIE_BOARD, _coord(0, 0)),
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
      ally1 = _createPlacedAlly(0, 0);
      ally2 = _createPlacedAlly(0, 0);
      enemy1 = _createLocatedEnemy(0, 0);
      enemy2 = _createLocatedEnemy(0, 0);
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

  describe('_choiceAimedUnit', function() {
    const ZeroReachAct = _createNReachAct(0, { friendshipType: FRIENDSHIP_TYPES.FRIENDLY });
    const OneReachAct = _createNReachAct(1, { friendshipType: FRIENDSHIP_TYPES.FRIENDLY });
    const TwoReachAct = _createNReachAct(2, { friendshipType: FRIENDSHIP_TYPES.FRIENDLY });
    const bigRect = _rect({ x: 0, y: 0, width: 48 * 10, height: 48 * 10 });

    describe('only units on the board', function() {
      beforeEach(function() {
        this.boardRect = _rect({ x: 0, y: 0, width: 48 * 3, height: 48 * 3 });
      });

      it('should only aims at units within the range of the board', function() {
        //
        //   012
        //     T
        // 0 ---T
        // 1 ---
        // 2T---
        //   T
        //
        const targets = [
          _createLocatedEnemy(48 * -1, 48 * 2),
          _createLocatedEnemy(0, 48 * 3),
          _createLocatedEnemy(48 * 2, 48 * -1),
          _createLocatedEnemy(48 * 3, 0),
        ];

        assert.strictEqual(
          _choiceAimedUnit(_createLocatedEnemy(0, 48 * 2), OneReachAct, targets, this.boardRect),
          null
        );

        assert.strictEqual(
          _choiceAimedUnit(_createLocatedEnemy(48 * 2, 0), OneReachAct, targets, this.boardRect),
          null
        );
      });
    });

    describe('reach check', function() {
      it('should aim the reach=0 act to same place', function() {
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

        assert.strictEqual(_choiceAimedUnit(_createPlacedAlly(1, 1), ZeroReachAct, targets, bigRect), targets[2]);
        assert.strictEqual(_choiceAimedUnit(_createPlacedAlly(2, 2), ZeroReachAct, targets, bigRect), null);
      });

      it('should aim the reach=1 act to adjacent place', function() {
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

        assert.strictEqual(_choiceAimedUnit(_createPlacedAlly(0, 1), OneReachAct, targets, bigRect), targets[0]);
        assert.strictEqual(_choiceAimedUnit(_createPlacedAlly(1, 0), OneReachAct, targets, bigRect), targets[0]);
        assert.strictEqual(_choiceAimedUnit(_createPlacedAlly(1, 2), OneReachAct, targets, bigRect), targets[1]);
        assert.strictEqual(_choiceAimedUnit(_createPlacedAlly(2, 1), OneReachAct, targets, bigRect), targets[1]);
        assert.strictEqual(_choiceAimedUnit(_createPlacedAlly(1, 1), OneReachAct, targets, bigRect), null);
      });

      it('should aim the reach=2 act to distant place', function() {
        //
        //  012
        // 0T--
        // 1---
        // 2---
        //
        const targets = [
          _createPlacedAlly(0, 0),
        ];

        assert.strictEqual(_choiceAimedUnit(_createPlacedAlly(0, 2), TwoReachAct, targets, bigRect), targets[0]);
        assert.strictEqual(_choiceAimedUnit(_createPlacedAlly(1, 1), TwoReachAct, targets, bigRect), targets[0]);
        assert.strictEqual(_choiceAimedUnit(_createPlacedAlly(2, 0), TwoReachAct, targets, bigRect), targets[0]);
        assert.strictEqual(_choiceAimedUnit(_createPlacedAlly(1, 2), TwoReachAct, targets, bigRect), null);
        assert.strictEqual(_choiceAimedUnit(_createPlacedAlly(2, 1), TwoReachAct, targets, bigRect), null);
      });
    });

    describe('closest order', function() {
      it('can execute correctly', function() {
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

        assert.strictEqual(_choiceAimedUnit(_createPlacedAlly(2, 0), TwoReachAct, targets, bigRect), targets[1]);
        assert.strictEqual(_choiceAimedUnit(_createPlacedAlly(1, 2), TwoReachAct, targets, bigRect), targets[2]);
      });
    });

    describe('clock-wise order', function() {
      it('should give priority to the top', function() {
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

        assert.strictEqual(_choiceAimedUnit(_createPlacedAlly(1, 1), OneReachAct, targets, bigRect), targets[1]);
      });

      it('should give priority to the right', function() {
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

        assert.strictEqual(_choiceAimedUnit(_createPlacedAlly(1, 1), OneReachAct, targets, bigRect), targets[2]);
      });

      it('should give priority to the down', function() {
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

        assert.strictEqual(_choiceAimedUnit(_createPlacedAlly(1, 1), OneReachAct, targets, bigRect), targets[0]);
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

  describe('_applyEffectToUnit', function() {
    beforeEach(function() {
      this.healthyUnit = _createLocatedUnit(0, 0);
      Object.assign(this.healthyUnit, {
        hitPoints: unitMethods.calculateHealingByRate(this.healthyUnit, 1.0).hitPoints,
      });

      this.woundedUnit = Object.assign(_createLocatedUnit(0, 0), {
        hitPoints: 1,
      });

      this.effect = _createEffectTemplate();
    });

    describe('healing', function() {
      it('can heal 1 pont', function() {
        Object.assign(this.effect, {
          healingPoints: 1,
        });

        const { newUnit, unitStateChangeLogs } = _applyEffectToUnit(this.effect, this.woundedUnit, 1);

        assert(newUnit.hitPoints > this.woundedUnit.hitPoints);
        assert.strictEqual(unitStateChangeLogs.length, 1);
        assert.strictEqual(unitStateChangeLogs[0].type, 'HEALING');
        assert.strictEqual(unitStateChangeLogs[0].value, 1);
      });
    });

    describe('damaging', function() {
      it('can damage 1 point', function() {
        Object.assign(this.effect, {
          damagePoints: 1,
        });

        const { newUnit, unitStateChangeLogs } = _applyEffectToUnit(this.effect, this.healthyUnit, 1);

        assert(this.healthyUnit.hitPoints > newUnit.hitPoints);
        assert.strictEqual(unitStateChangeLogs.length, 1);
        assert.strictEqual(unitStateChangeLogs[0].type, 'DAMAGE');
        assert.strictEqual(unitStateChangeLogs[0].value, 1);
      });
    });

    describe('multiple state changes', function() {
      it('can return multiple logs', function() {
        Object.assign(this.effect, {
          damagePoints: 1,
          healingPoints: 2,
        });

        const { unitStateChangeLogs } = _applyEffectToUnit(this.effect, this.healthyUnit, 1);

        assert.strictEqual(unitStateChangeLogs.length, 2);
      });
    });
  });

  describe('_effectOccurs', function() {
    beforeEach(function() {
      this.farEndPointCoordinate = _coord(99, 99);
    });

    describe('affectableFractionTypes', function() {
      beforeEach(function() {
        this.ally = Object.assign(_createPlacedAlly(1, 2), {
          fixedMaxHitPoints: 5,
          hitPoints: 5,
        });
        this.enemy = Object.assign(_createLocatedEnemy(48, 96), {
          fixedMaxHitPoints: 5,
          hitPoints: 5,
        });
      });

      it('can affect to an ally', function() {
        const effect = _effect([FACTION_TYPES.ALLY], _loc(48, 96), {
          relativeCoordinates: [[0, 0]],
          damagePoints: 1,
        });
        const { units } = _effectOccurs(effect, [this.ally, this.enemy], 1, this.farEndPointCoordinate);

        assert(units[0].hitPoints < this.ally.hitPoints);
        assert(units[1].hitPoints === this.enemy.hitPoints);
      });

      it('can affect to an enemy', function() {
        const effect = _effect([FACTION_TYPES.ENEMY], _loc(48, 96), {
          relativeCoordinates: [[0, 0]],
          damagePoints: 1,
        });
        const { units } = _effectOccurs(effect, [this.ally, this.enemy], 1, this.farEndPointCoordinate);

        assert(units[0].hitPoints === this.ally.hitPoints);
        assert(units[1].hitPoints < this.enemy.hitPoints);
      });
    });

    describe('target type', function() {
      beforeEach(function() {
        this.enemy = Object.assign(_createLocatedEnemy(48, 96), {
          fixedMaxHitPoints: 5,
          hitPoints: 5,
        });

        this.effect = _effect([FACTION_TYPES.ENEMY], _loc(72, 120), {
          aimedUnitUid: this.enemy.uid,
          damagePoints: 1,
        });
      });

      it('can affect', function() {
        const { units: [ newEnemy ] } = _effectOccurs(this.effect, [this.enemy], 1, this.farEndPointCoordinate);

        assert(newEnemy.hitPoints < this.enemy.hitPoints);
      });

      it('can not affect if uids are different', function() {
        this.enemy.uid = 'another_uid';

        const { units: [ newEnemy ] } = _effectOccurs(this.effect, [this.enemy], 1, this.farEndPointCoordinate);

        assert(newEnemy.hitPoints === this.enemy.hitPoints);
      });

      it('can not affect if the bullet does not hit', function() {
        this.effect.impactedLocation = _loc(0, 0);

        const { units: [ newEnemy ] } = _effectOccurs(this.effect, [this.enemy], 1, this.farEndPointCoordinate);

        assert(newEnemy.hitPoints === this.enemy.hitPoints);
      });
    });

    describe('range type', function() {
      beforeEach(function() {
        this.ally = Object.assign(_createPlacedAlly(1, 2), {
          fixedMaxHitPoints: 5,
          hitPoints: 5,
        });

        this.effect = _effect([FACTION_TYPES.ALLY], _loc(72, 120), {
          relativeCoordinates: [ [0, 0] ],
          damagePoints: 1,
        });
      });

      it('can affect', function() {
        const { units: [ newAlly ] } = _effectOccurs(this.effect, [this.ally], 1, this.farEndPointCoordinate);

        assert(newAlly.hitPoints < this.ally.hitPoints);
      });

      it('can not affect if it is out of range', function() {
        const effect = _effect([FACTION_TYPES.ALLY], _loc(72, 120), {
          relativeCoordinates: [ [2, 0] ],
          damagePoints: 1,
        });

        const { units: [ newAlly ] } = _effectOccurs(effect, [this.ally], 1, this.farEndPointCoordinate);

        assert(newAlly.hitPoints === this.ally.hitPoints);
      });
    });

    describe('log creation', function() {
      beforeEach(function() {
        this.enemy = Object.assign(_createLocatedEnemy(48, 96), {
          fixedMaxHitPoints: 5,
          hitPoints: 5,
        });

        this.effect = _effect([FACTION_TYPES.ENEMY], _loc(72, 120), {
          aimedUnitUid: this.enemy.uid,
        });
      });

      it('can return a log about damaging', function() {
        Object.assign(this.effect, {
          damagePoints: 10,
        });

        const { unitStateChangeLogs } = _effectOccurs(this.effect, [this.enemy], 123, this.farEndPointCoordinate);

        assert.strictEqual(unitStateChangeLogs.length, 1);

        assert.strictEqual(typeof unitStateChangeLogs[0].uid, 'string');
        assert.strictEqual(unitStateChangeLogs[0].unitUid, this.enemy.uid);
        assert.strictEqual(unitStateChangeLogs[0].tickId, 123);
        assert.strictEqual(unitStateChangeLogs[0].type, 'DAMAGE');
        assert.strictEqual(unitStateChangeLogs[0].value, 10);
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
