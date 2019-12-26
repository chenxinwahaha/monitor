/**
 * Created by 陈鑫 on 2018/4/11.
 */
import React, {Component} from 'react'
import styles from './index.less'
import Circle from './circle/index'
import {Carousel} from 'antd'
import NodeBar from '../nodeAnalysis/nodeBar/index'

const width = document.body.clientWidth
const height = document.body.clientHeight
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
  }

  renderCircle() {
    const {esHealth, tablespaces} = this.props
    let divs = []
    if (tablespaces && tablespaces.length > 0) {
      const showList = tablespaces.filter(item => item.PERCENT > 80 || item.PERCENT == 80)
      if (showList && showList.length) {
        let count = Math.ceil(showList.length / 4)
        for (let i = 0; i < count; i++) {
          const singData = showList.slice(i * 4, i * 4 + 4)
          let div = <div className={styles.node} style={{
            backgroundImage: 'url(application/img/function_bg.png)',
          }}>
            <div className={styles.top} style={{height: height * 0.015}}>
              <span>表空间</span>
            </div>
            <div className={styles.bottom}>
              {this.renderTablespace(singData)}
            </div>
          </div>
          divs.push(div)
        }
      }
    }
    if (esHealth) {
      let div = <div className={styles.node} style={{
        backgroundImage: 'url(application/img/function_bg.png)',
      }}>
        <div className={styles.top} style={{height: height * 0.015}}>
          <span>ElasticSearch</span>
        </div>
        <div className={styles.bottom}>
          {esHealth.filter(item => item.name == "RAM") && esHealth.filter(item => item.name == "RAM").length ? this.renderOS(esHealth.filter(item => item.name == "RAM")[0]) : void 0}
          {esHealth.filter(item => item.name == "JVM") && esHealth.filter(item => item.name == "JVM").length ? this.renderJVM(esHealth.filter(item => item.name == "JVM")[0]) : void 0}
          {esHealth.filter(item => item.name == "CPU") && esHealth.filter(item => item.name == "CPU").length ? this.renderCPU(esHealth.filter(item => item.name == "CPU")[0]) : void 0}
          {esHealth.filter(item => item.name == "FS") && esHealth.filter(item => item.name == "FS").length ? this.renderFS(esHealth.filter(item => item.name == "FS")[0]) : void 0}
        </div>
      </div>
      divs.push(div)
    }

    return (

      <Carousel dots={false} autoplay={true} autoplaySpeed={6000} vertical>{divs}</Carousel>)
  }

  renderOS(value) {
    if (value.used) {
      let num = parseInt(value.used * 100 / value.total)
      return <NodeBar percentage={num} a={num > 80 || num == 80 ? "#ffa80d" : "#3e9cf7"} name={value.name}/>
    }
  }

  renderJVM(value) {
    if (value.used) {
      let num = parseInt(value.used * 100 / value.total)
      return <NodeBar percentage={num} a={num > 80 || num == 80 ? "#ffa80d" : "#33ccff"} name={value.name}/>
    }
  }

  renderCPU(value) {
    let num = parseInt(value.percent)
    return <NodeBar percentage={num} a={num > 80 || num == 80 ? "#ffa80d" : "#79e779"}
                    name={value.name}/>
  }

  renderFS(value) {
    if (value.used) {
      let num = parseInt(value.used * 100 / value.total)
      return <NodeBar percentage={num} a={num > 80 || num == 80 ? "#ffa80d" : "#19dc7c"} name={value.name}/>
    }
  }

  renderTablespace(singData) {
    if (singData && singData.length) {
      return singData.map((item) => {
        return <NodeBar percentage={Math.floor(item.PERCENT)} a="#ffa80d" name={item.NAME}/>
      })
    }
  }

  render() {
    const {esHealth, tablespaces} = this.props
    return (
      <div className={styles.body} style={{height: height * 0.22}}>
        <style>
          {`.ant-carousel .slick-vertical .slick-slide{
      height: ${height * 0.22}px !important
    }`}
        </style>
        {this.renderCircle()}
      </div>
    )
  }
}
