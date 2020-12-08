/**
 * FileName: index,Echarts
 * Author:   wxxx
 * Date:     2018/10/16 9:34 AM
 */
import React, {Component} from 'react';
import {connect} from 'dva'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class Index extends Component {
  componentDidMount() {
    this.setEchartsOption()
  }
  setEchartsOption() {
    const {titleText, xAxisData, yAxisData, lineColor, dataSource, type, dispatch, code} = this.props;
    const {selectHour, inHome} = this.props.mobile
    echarts.dispose(document.getElementById(type))
    let myChart = echarts.init(document.getElementById(type));
    let dataSourceIsNull = (0 !== dataSource.length)
    let typeIsWeek = ('本周' == type)


    myChart.setOption({
      title: {
        text: titleText,
        x: '30rem',
        y: '20rem',
        textStyle: {
          width: '3rem',
          height: '2rem',
          color: '#333333',
          fontWeight: 'normal',
          fontFamily: 'PingFangSC-Regular',
          fontSize: 30
        }
      },
      grid: {
        left: '4%',   // 与容器左侧的距离
        right: '5%', // 与容器右侧的距离
        top: '20%',   // 与容器顶部的距离
        bottom: '20%', // 与容器底部的距离
        containLabel: true
      },
      tooltip: {
        trigger: 'axis'
      },

      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          start: 0, //数据窗口范围的起始百分比
          end: 100,
          bottom: 20,
          height: 45, //组件高度
          handleSize: '120%'
        }
      ],


      xAxis: {
        scale: true,
        boundaryGap: typeIsWeek,
        type: 'category',
        data: xAxisData,
        interval: 0,
        axisTick: {//去掉刻度
          show: false
        },
        axisLabel: {
          textStyle: {
            fontSize: 20 // 让字体变大
          }
        }
      },
      yAxis: {
        type: 'value',
        max: dataSourceIsNull ? void (0) : 10,
        min: dataSourceIsNull ? void (0) : 0,
        splitNumber: dataSourceIsNull ? void (0) : 5,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#eeeeee',
            width: 1
          }
        },
        axisLabel: {
          textStyle: {
            fontSize: 25 // 让字体变大
          }
        }
      },
      series: [{
        data: this.getAxisList(dataSource, type, typeIsWeek),
        type: 'line',
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          normal: {
            color: lineColor,
            lineStyle: {
              color: lineColor
            }
          }
        },
        smooth: true
      }],
    });

    myChart.getZr().on('click', function (params) {
      var pointInPixel = [params.offsetX, params.offsetY];
      if (myChart.containPixel('grid', pointInPixel)) {

        let pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel);
        //X轴序号
        let xIndex = pointInGrid[0];

        //获取当前图表的option
        let op = myChart.getOption();

        //获得图表中想要的数据
        let xA = op.xAxis[0].data[xIndex];
        let xATemp;
        switch (xA) {
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
            xATemp = xA;
            break
        }
        {
          code ? dispatch({
            type: 'mobile/setState',
            payload: {selectHour: xATemp, inHome: xATemp}
          }) : void 0
        }
      }
    });
  }

  getAxisList(dataSource, type, typeIsWeek) {
    var list = []
    let i = 0
    dataSource.forEach(e => {
      if ("本周" == type) {
        list.push(e[i + 1])
      } else if ("今日" == type || "昨日" == type) {
        list.push(e[i * 3])
      }
      i++
    })
    return list
  }

  render() {
    const {type, code} = this.props
    return (
      <div id={type} style={{width: "100%", height: "38rem"}}></div>
    );
  }
}


export default connect((appModel) => (appModel))(Index)
