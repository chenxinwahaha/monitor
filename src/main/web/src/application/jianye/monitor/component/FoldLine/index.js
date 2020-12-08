/**
 * FileName: index,F2
 * Author:   wxxx
 * Date:     2018/11/8
 */
import React, {Component} from 'react';
import {connect} from 'dva';
import styles from './index.less'
import F2 from '@antv/f2'
import Tooltip from '@antv/f2/lib/plugin/tooltip'
import $ from 'jquery';

window.$ = $;

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      valueList: []
    }
  }

  componentDidMount() {
    const {dataSource, xAxisData, lineColor, code, dispatch, type} = this.props
    const {valueList} = this.state
    //坐标值数组,[{x,y},{x,y}]
    for (let i = 0; i < xAxisData.length; i++) {
      let v = {
        xKey: xAxisData[i],
        yValue: typeof(dataSource[i]) !== "undefined" || null ?
          ("星期一" === xAxisData[0] ? dataSource[i][i + 1] : dataSource[i][xAxisData[i]])
          : null
      }
      valueList.push(v)
    }
    const chart = new F2.Chart({
      id: type,
      plugins: Tooltip,
      pixelRatio: window.devicePixelRatio
    })
    //数据源
    chart.source(valueList);
    //折线、阴影、点
    chart.line().position('xKey*yValue').shape('smooth').color(lineColor);
    chart.area().position('xKey*yValue').shape('smooth').color(lineColor);
    chart.point().position('xKey*yValue').color(lineColor);
    //坐标轴属性
    chart.axis('xKey', {
      label: {
        fontSize: 20,
      }
    });
    chart.axis('yValue', {
      label: {
        fontSize: 25,
      }
    });
    //辅助线
    chart.tooltip({
      showCrosshairs: true,
      valueStyle: {
        lineHeight: "3rem",
        fontSize: 25,
        fill: '#fff',
        textAlign: 'start',
        textBaseline: 'middle'
      },
      crosshairsStyle: {stroke: 'rgba(0, 0, 0, 0.25)', lineWidth: 2},
      onShow(ev) {
        var items = ev.items;
        items[0].name = null;
      }
    })
    //点击 ==>x轴刻度<== 时候，获取对应坐标
    $('#' + type).on('touchstart', function (e) {
      const canvas = chart.get('canvas');
      const point = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
      };
      const canvasPoint = F2.Util.getRelativePosition(point, canvas); // 将坐标转换为 canvas 相对坐标
      // 根据画布坐标获取对应数据集
      const data = chart.getSnapRecords(canvasPoint);
      let time = data ? data[0]._origin.xKey : null;
      let xATemp;
      switch (time) {
        case "星期一":
          xATemp = 1;
          break;
        case "星期二":
          xATemp = 2;
          break;
        case "星期三":
          xATemp = 3;
          break;
        case "星期四":
          xATemp = 4;
          break;
        case "星期五":
          xATemp = 5;
          break;
        case "星期六":
          xATemp = 6;
          break;
        case "星期日":
          xATemp = 7;
          break;
        default:
          xATemp = time;
          break
      }
      {
        code ? dispatch({
          type: 'mobile/setState',
          payload: {selectHour: xATemp, inHome: xATemp}
        }) : void 0
      }
    });
    chart.render();
  }

  render() {
    const {valueList} = this.state
    const {type} = this.props
    return (
      valueList ?
        <div className={styles.foldLine}>
          <canvas id={type} style={{width: '100%', height: '100%'}}></canvas>
        </div> : void (0)
    );
  }
}

export default connect((appModel) => (appModel))(Index)
