/**
 * Created by 陈鑫 on 2018/4/12.
 */
import React, {Component} from 'react'
import {connect} from 'dva'

var echarts = require('echarts')
import styles from './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch({
      type: 'node/queryMobileTablespaceInfo', callback: () => {
        this.renderPie()
      }
    })

  }

  renderPie() {
    const {tableSpace} = this.props.node
    tableSpace && tableSpace.length > 0 ? tableSpace.map((table, index) => {
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: [table.PERCENT > 80 || table.PERCENT == 80 ? "#ffa80d" : "#19dc7c", '#e7e7e7'],
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {value: table.PERCENT, name: 'percent'},
              {value: 100 - table.PERCENT, name: 'out-percent'},
            ]
          }
        ]
      };
      let node = document.getElementById(index)
      if (node) {
        let moneyLineChart = echarts.init(node)
        moneyLineChart.setOption(option)
      }
    }) : void(0)

  }

  sortTable() {
    return function (a, b) {
      return b.PERCENT - a.PERCENT
    }
  }

  render() {
    const {percentage, a, name} = this.props
    const {tableSpace} = this.props.node
    tableSpace.sort(this.sortTable())
    return (
      <div className={styles.total}>
        <div className={styles.title}>
          <div className={styles.content}>
            <div className={styles.left}>
              <img src="./application/mobile/node/tablespace.png"/>
              <span className={styles.node}>表空间</span>
            </div>

          </div>
        </div>
        <div className={styles.lineBars}>
          {tableSpace && tableSpace.length > 0 ? tableSpace.map((item, index) => {
            return item.PERCENT > 80 ? <div className={styles.data} key={index}>
              <div id={index} style={{width: '17.8rem', height: '17.8rem'}}/>
              <div className={styles.percent}
                   style={{color: item.PERCENT > 80 || item.PERCENT == 80 ? "#ffa80d" : "#19dc7c"}}>{item.PERCENT}%
              </div>
              <div className={styles.name}>{item.NAME}</div>
            </div> : void(0)
          }) : void(0)
          }
        </div>
      </div>
    )
  }
}

export default connect(({node}) => ({node}))(Index)
