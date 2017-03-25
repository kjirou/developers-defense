// @flow

const React = require('react');


/*::
type Props = {
  classNames: string[],
  frameWidth: number,
  height: number,
  rate: number,
  width: number,
};

type DefaultProps = {
  classNames: $PropertyType<Props, 'classNames'>,
};

export type GaugeProps = {
  ...DefaultProps,
  frameWidth: $PropertyType<Props, 'frameWidth'>,
  height: $PropertyType<Props, 'height'>,
  rate: $PropertyType<Props, 'rate'>,
  width: $PropertyType<Props, 'width'>,
};
 */

const defaultProps/*:DefaultProps*/ = {
  classNames: [],
};

const Gauge = ({ classNames, frameWidth, height, rate, width }/*:Props*/) => {
  const myProps = {
    className: ['gauge'].concat(classNames).join(' '),
    style: {
      width,
      height,
    },
  };

  const maxScaleWidth = width - frameWidth * 2;
  const scaleWidth = Math.ceil(maxScaleWidth * rate);

  const scale = React.createElement('div', {
    className: 'gauge__scale',
    style: {
      top: frameWidth,
      left: frameWidth,
      width: scaleWidth,
      height: height - frameWidth * 2,
    },
  });

  return React.createElement('div', myProps, scale);
};

Gauge.defaultProps = defaultProps;


module.exports = Gauge;
