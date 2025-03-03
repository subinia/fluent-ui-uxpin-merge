/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
  curveBundle,
  curveCardinal,
  curveCardinalClosed,
  curveCardinalOpen,
  curveCatmullRom,
  curveCatmullRomClosed,
  curveCatmullRomOpen,
} from 'd3-shape';
import PropTypes from 'prop-types';
import React from 'react';
import {
  AreaSeries,
  Crosshair,
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from 'react-vis';
import AreaChartStyles from './AreaChart.styles';
import * as UXPinParser from '../../_helpers/UXPinParser';
import { UxpColors } from '../../_helpers/uxpcolorutils';

export default class AreaChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      crosshairValues: [],
      data: this.getData(),
      // eslint-disable-next-line react/no-unused-state
      hintValue: {},
    };
  }

  componentDidMount() {
    this.setState({ data: this.getData() });
  }

  getCrosshair(value, { index }) {
    this.setState({ crosshairValues: this.getData().map((d) => d[index]) });
  }

  restartCrosshair() {
    this.setState({ crosshairValues: [] });
  }

  getColorRange() {
    return UXPinParser.parse(this.props.colorRange).map((item) => (UxpColors.getHexFromHexOrToken(item.text)));
  }

  getData() {
    const parsedOutput = UXPinParser.parse(this.props.data);
    let firstDataSet = [], secondDataSet = [];
    let switchDataSet = false;

    for (let i = 0; i < parsedOutput.length; i++) {
      // Data Sets are seperated by a single line break
      // ...in which case the CSV parser returns and empty string
      if (parsedOutput[i].text === '') {
        switchDataSet = true;
        continue;
      }

      if (!switchDataSet) {
        // Is this an odd or even row of the array?
        if (i % 2 === 0) {
          firstDataSet.push({
            x: parseInt(parsedOutput[i].text.split('x ')[1]),
            y: undefined,
          });
        } else {
          firstDataSet[firstDataSet.length-1].y = parseInt(parsedOutput[i].text.split('y ')[1]);
        }
      } else {
        // Is this an odd or even row of the array?
        if (i % 2 !== 0) {
          secondDataSet.push({
            x: parseInt(parsedOutput[i].text.split('x ')[1]),
            y: undefined,
          });
        } else {
          secondDataSet[secondDataSet.length-1].y = parseInt(parsedOutput[i].text.split('y ')[1]);
        }
      }
    }

    return [firstDataSet, secondDataSet];
  }

  render() {
    const curve = (type) => {
      switch (type) {
        case 'curveNatural':
          return type;
        case 'curveBasis':
          return type;
        case 'curveBasisClosed':
          return type;
        case 'curveLinear':
          return type;
        case 'curveLinearClosed':
          return type;
        case 'curveMonotoneX':
          return type;
        case 'curveMonotoneY':
          return type;
        case 'curveStep':
          return type;
        case 'curveStepAfter':
          return type;
        case 'curveStepBefore':
          return type;
        case 'curveCatmullRom':
          return curveCatmullRom.alpha(
            parseFloat(this.props.curveCatmullRomAlpha)
          );
        case 'curveCatmullRomClosed':
          return curveCatmullRomClosed.alpha(
            parseFloat(this.props.curveCatmullRomAlpha)
          );
        case 'curveCatmullRomOpen':
          return curveCatmullRomOpen.alpha(
            parseFloat(this.props.curveCatmullRomAlpha)
          );
        case 'curveBundle':
          return curveBundle.beta(parseFloat(this.props.curveBundleBeta));
        case 'curveCardinal':
          return curveCardinal.tension(
            parseFloat(this.props.curveCardinalTension)
          );
        case 'curveCardinalOpen':
          return curveCardinalOpen.tension(
            parseFloat(this.props.curveCardinalTension)
          );
        case 'curveCardinalClosed':
          return curveCardinalClosed.tension(
            parseFloat(this.props.curveCardinalTension)
          );
        case 'no curve':
        default:
          return '';
      }
    };
    return (
      <XYPlot
        height={this.props.height}
        width={this.props.width}
        css={AreaChartStyles}
        onMouseLeave={() => this.restartCrosshair()}
        margin={this.props.margin}>
        {this.props.verticalGridLines ? <VerticalGridLines /> : undefined}
        {this.props.horizontalGridLines ? <HorizontalGridLines /> : undefined}
        {this.props.xLabels ? <XAxis /> : undefined}
        {this.props.yLabels ? <YAxis /> : undefined}
        {!Array.isArray(this.getData()[0]) ? (
          <AreaSeries
            data={this.getData()}
            color={
               this.getColorRange !== undefined
            && this.getColorRange()[0]
              ? this.getColorRange()[0]
              : this.props.color
            }
            curve={curve(this.props.curve)}
            opacity={
              this.props.styles !== undefined
            && this.props.styles[0]
            && this.props.styles[0].opacity
                ? parseFloat(this.props.styles[0].opacity)
                : parseFloat(this.props.opacity)
            }
            stroke={
              this.props.strokeColorRange !== undefined
            && this.props.strokeColorRange[0]
                ? this.props.strokeColorRange[0]
                : this.props.strokeColor
            }
            strokeWidth={
              this.props.styles !== undefined
            && this.props.styles[0]
            && this.props.styles[0].strokeWidth
                ? this.props.styles[0].strokeWidth
                : this.props.strokeWidth
            }
            strokeStyle={
              this.props.styles !== undefined
            && this.props.styles[0]
            && this.props.styles[0].strokeStyle
                ? this.props.styles[0].strokeStyle
                : this.props.strokeStyle
            }
            onNearestX={(value, index) => this.getCrosshair(value, index)}
            onNearestXY={this.props.onNearestXY}
            onSeriesClick={this.props.onSeriesClick}
            onSeriesRightClick={this.props.onSeriesRightClick}
            onSeriesMouseOver={this.props.onSeriesMouseOver}
            onSeriesMouseOut={this.props.onSeriesMouseOver}
            animation={this.props.animation}
          />
        ) : (
          this.getData().map((e, i) => (
            <AreaSeries
              key={i}
              data={this.getData()[i]}
              color={
                this.getColorRange !== undefined
                && this.getColorRange()[i]
                  ? this.getColorRange()[i]
                  : this.props.color
                }
              curve={curve(this.props.curve)}
              opacity={
                  this.props.styles !== undefined
                  && this.props.styles[i]
                  && this.props.styles[i].opacity
                    ? parseFloat(this.props.styles[i].opacity)
                    : parseFloat(this.props.opacity)
                }
              stroke={
                  this.props.strokeColorRange !== undefined
                  && this.props.strokeColorRange[i]
                    ? this.props.strokeColorRange[i]
                    : this.props.strokeColor
                }
              strokeWidth={
                  this.props.styles !== undefined
                  && this.props.styles[i]
                  && this.props.styles[i].strokeWidth
                    ? this.props.styles[i].strokeWidth
                    : this.props.strokeWidth
                }
              strokeStyle={
                  this.props.styles !== undefined
                  && this.props.styles[i]
                  && this.props.styles[i].strokeStyle
                    ? this.props.styles[i].strokeStyle
                    : this.props.strokeStyle
                }
              onNearestX={(value, index) => this.getCrosshair(value, index)}
              onNearestXY={this.props.onNearestXY}
              onSeriesClick={this.props.onSeriesClick}
              onSeriesRightClick={this.props.onSeriesRightClick}
              onSeriesMouseOver={this.props.onSeriesMouseOver}
              onSeriesMouseOut={this.props.onSeriesMouseOver}
              animation={this.props.animation}
            />
          ))
        )}
        {this.props.crossHair ? <Crosshair values={this.state.crosshairValues} /> : undefined}
      </XYPlot>
    );
  }
}

/* eslint-disable sort-keys */
AreaChart.propTypes = {
  /** Height of the Chart in px. Accepts only numbers. */
  height: PropTypes.number,
  /** Width of the Chart in px. Accepts only numbers. */
  width: PropTypes.number,
  /** Turns, on/off animation and allows for selection of different types of animations. */
  animation: PropTypes.oneOf([false, 'noWobble', 'gentle', 'wobbly', 'stiff']),
  /**
   * Color to be used on all chart lines, unless colorRange is provided
   * @uxpinignoreprop
   */
  color: PropTypes.string,
  /** Array with colors to be used across all chart lines. If array doesn't specify color for all the chart lines, color property is used. */
  /**
   * @uxpincontroltype codeeditor
   */
  colorRange: PropTypes.string,
  /**
   * Turns on/off crossHair
   * @uxpindescription Turns on/off crossHair (only in prototype preview)
   */
  crossHair: PropTypes.bool,
  /** Select the kind of curve for all the chart lines */
  curve: PropTypes.oneOf([
    'no curve',
    'curveNatural',
    'curveBasis',
    'curveBasisClosed',
    'curveLinear',
    'curveLinearClosed',
    'curveMonotoneX',
    'curveMonotoneY',
    'curveStep',
    'curveStepAfter',
    'curveStepBefore',
    'curveCatmullRom',
    'curveCatmullRomOpen',
    'curveCatmullRomClosed',
    'curveBundle',
    'curveCardinal',
    'curveCardinalOpen',
    'curveCardinalClosed',
  ]),
  /**
   * Additional param to modify the curvature of curveBundleBeta
   * @uxpinignoreprop
   */
  curveBundleBeta: PropTypes.string,
  /**
   * Additional param to modify the curvature of curveCardinal, curveCardinalOpen, curveCardinalClosed
   * @uxpinignoreprop
   */
  curveCardinalTension: PropTypes.string,
  /**
   * Additional param to modify the curvature of curveCatmullRom, curveCatmullRomOpen and curveCatmullRomClosed
   * @uxpinignoreprop
   */
  curveCatmullRomAlpha: PropTypes.string,
  /**
   * @uxpincontroltype codeeditor
   */
  data: PropTypes.string,
  /** Turns on/off horizontal grid lines. */
  horizontalGridLines: PropTypes.bool,
  /** Turns on/off vertical grid lines. */
  verticalGridLines: PropTypes.bool,
  /**
   * Sets margin for the chart inside of the container. Format: {"top": 0, "right": 0, "bottom": 0, "left": 0 }
   * @uxpinignoreprop
   */
  margin: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
  }),
  /**
   * @uxpinignoreprop
   */
  onNearestXY: PropTypes.func,
  /**
   * @uxpinignoreprop
   */
  onSeriesClick: PropTypes.func,
  /**
   * @uxpinignoreprop
   */
  // eslint-disable-next-line react/no-unused-prop-types
  onSeriesMouseOut: PropTypes.func,
  /**
   * @uxpinignoreprop
   */
  onSeriesMouseOver: PropTypes.func,
  /**
   * @uxpinignoreprop
   */
  onSeriesRightClick: PropTypes.func,
  /** Specifies opacity for all the chart lines, unless styles array is provided */
  opacity: PropTypes.string,
  /** Color of the upper edge of the area. Overrides color property/ */
  strokeColor: PropTypes.string,
  /** Array of colors of the upper edge of the area. Overrides color property/ */
  strokeColorRange: PropTypes.arrayOf(PropTypes.string),
  /** Specifies style of the line for all the chart lines, unless styles array is provided */
  strokeStyle: PropTypes.oneOf(['solid', 'dashed']),
  /** Specifies width of the line for all the chart lines, unless styles array is provided */
  strokeWidth: PropTypes.number,
  /**
   * Object with styles that allows for specifying styles for every line separtely. Accepts: StrokeStyle, StrokeWidth and Opacity. Format: [{"strokeStyle": "solid"}]
   * @uxpinignoreprop
   */
  styles: PropTypes.arrayOf(PropTypes.object),

  /**
   * Turns on/off horizontal labels.
   * @uxpinpropname Show X labels
   */
  xLabels: PropTypes.bool,
  /**
   * Turns on/off vertical labels.
   * @uxpinpropname Show Y labels
   */
  yLabels: PropTypes.bool,
};
/* eslint-enable sort-keys */

AreaChart.defaultProps = {
  crossHair: false,
  height: 300,
  horizontalGridLines: true,
  strokeStyle: 'solid',
  strokeWidth: 3,
  verticalGridLines: true,
  width: 300,
  xLabels: true,
  yLabels: true,
};
