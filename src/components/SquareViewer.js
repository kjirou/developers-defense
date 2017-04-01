// @flow

/**
 * TODO:
 * - ユニット詳細
 *   - アイコン・名前・バフ状態・味方の場合は加えてアクティブスキル選択x3
 * - 地形詳細
 *   - ユニットが居ないマスを選択している場合
 * - (全体の情報)
 *   - どこも選択していない場合、常に表示する必要がないような、戦闘全体に関わる情報を表示
 */


/*::
import type { LandformType } from '../immutable/constants';
import type { UnitProps } from './Unit';
 */

const React = require('react');

const SquareMatrix = require('./SquareMatrix');

const h = React.createElement;


/*::
type Props = {
  landformType: LandformType,
  unit: UnitProps | null,
};

type DefaultProps = {
  landformType?: $PropertyType<Props, 'landformType'>,
  unit?: $PropertyType<Props, 'unit'>,
};

export type SquareViewerProps = {
  ...DefaultProps,
};
 */

const defaultProps/*:DefaultProps*/ = {
  unit: null,
};

const SquareViewer = ({ landformType, unit }/*:Props*/) => {
  const myProps = {
    className: 'root__square-viewer',
  };

  const singleSquareMatrix = h(SquareMatrix, {
    key: 'single-square-matrix',
    serialSquares: [
      {
        rowIndex: 0,
        columnIndex: 0,
        landformType,
      },
    ],
    units: unit ? [unit] : [],
  });

  const parametersAndStatus = h('div', {
    key: 'parameters-and-status',
    className: 'root__square-viewer__parameters-and-status',
  });

  const skillButtons = [0, 1, 2].map(skillIndex => {
    return h('div', {
      key: 'skill-' + skillIndex,
      className: 'root__square-viewer__skill-buttons-container__button',
      style: {
        left: 48 * skillIndex,
      },
    });
  });

  const skillButtonsContainer = h('div', {
    key: 'skill-buttons-container',
    className: 'root__square-viewer__skill-buttons-container',
  }, skillButtons);

  const components = [];
  components.push(singleSquareMatrix);
  components.push(parametersAndStatus);
  components.push(skillButtonsContainer);

  return h('div', myProps, ...components);
};

SquareViewer.defaultProps = defaultProps;


module.exports = SquareViewer;
