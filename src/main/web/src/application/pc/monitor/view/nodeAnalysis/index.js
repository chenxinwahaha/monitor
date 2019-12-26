/**
 * Created by 陈鑫 on 2018/4/11.
 */
import React, {Component} from 'react'
import styles from './index.less'
import NodeBar from './nodeBar/index'
import {Carousel} from 'antd'

const width = document.body.clientWidth
const height = document.body.clientHeight
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }

  renderNodes() {
    const {nodeInfos, speed, esHealth, tablespaces, index} = this.props
    let divs = []
    if (esHealth) {
      let div = <div className={styles.node} style={{
        backgroundImage: 'url(application/img/function_bg.png)',
      }}>
        <div className={styles.top} style={{height: height * 0.015}}>
          <span>ElasticSearch</span>
        </div>
        <div className={styles.bottom}>
          {esHealth && esHealth.RAM ? this.renderOS(esHealth.RAM) : void(0)}
          {esHealth && esHealth.JVM ? this.renderESJVM(esHealth.JVM) : void(0)}
          {esHealth && esHealth.CPU ? this.renderCPU(esHealth.CPU) : void(0)}
          {esHealth && esHealth.FS ? this.renderFS(esHealth.FS) : void(0)}
        </div>
      </div>
      divs.push(div)
    }
    if (nodeInfos && nodeInfos.length) {
      nodeInfos.map((item) => {
        let div = <div className={styles.node} style={{
          backgroundImage: 'url(application/img/function_bg.png)',
        }}>
          <div className={styles.top} style={{height: height * 0.015}}>
            <span>{item.name}</span>
          </div>
          <div className={styles.bottom}>
            {item.value ? this.renderSystemLoad(item.value) : void 0}
            {item.value ? this.renderJVM(item.value) : void 0}
            {item.value ? this.renderRAM(item.value) : void 0}
            {item.value ? this.renderThread(item.value) : void 0}
            {item.value ? this.renderDisk(item.value) : void 0}
          </div>
        </div>
        divs.push(div)
      })
    }
    if (tablespaces && tablespaces.length) {
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
    if (divs.length) {
      let i = index
      while (i > 0) {
        let moveDiv = divs[0]
        divs.splice(0, 1)
        divs.push(moveDiv)
        i--;
      }
    }
    return (<Carousel dots={false} autoplay={true} autoplaySpeed={speed} vertical>{divs}
    </Carousel>)
  }

  renderJVM(value) {
    if (value.jvm) {
      let num = parseInt(value.jvm.usage * 100 / value.jvm.total)
      return <NodeBar percentage={num} a={num > 80 || num == 80 ? "#ffa80d" : "#3e9cf7"} name="JVM"/>
    }
  }

  renderSystemLoad(value) {
    if (value.systemload) {
      let num = parseInt(value.systemload)
      return <NodeBar percentage={num} a={num > 80 || num == 80 ? "#ffa80d" : "#66ccff"} name="CPU"/>
    }
  }

  renderRAM(value) {
    if (value.ram) {
      let num = parseInt(value.ram.usage * 100 / value.ram.total)
      return <NodeBar percentage={num} a={num > 80 || num == 80 ? "#ffa80d" : "#33ccff"} name="RAM"/>
    }
  }

  renderDisk(value) {
    if (value.disk && value.disk.length) {
      return value.disk.map((item, index) => {
        let num = parseInt(item.usage * 100 / item.total)
        return 0 !== item.total ? <NodeBar percentage={num} a={num > 80 || num == 80 ? "#ffa80d" : "#79e779"}
                                           name={item.name ? item.name : "磁盘"}/> : void(0)
      })
    }
  }

  renderThread(value) {
    if (value.thread) {
      let num = parseInt(value.thread.size * 100 / 2000)

      return <NodeBar percentage={num} a={num > 80 || num == 80 ? "#ffa80d" : "#19dc7c"} name="线程"/>
    }
  }

  renderOS(value) {
      return <NodeBar percentage={value} a={value > 80 || value == 80 ? "#ffa80d" : "#3e9cf7"} name="RAM"/>
  }

  renderESJVM(value) {
    return <NodeBar percentage={value} a={value > 80 || value == 80 ? "#ffa80d" : "#33ccff"} name='JVM'/>
  }

  renderCPU(value) {
    return <NodeBar percentage={value} a={value > 80 || value == 80 ? "#ffa80d" : "#79e779"} name='CPU'/>
  }

  renderFS(value) {
    return <NodeBar percentage={value} a={value > 80 || value == 80 ? "#ffa80d" : "#19dc7c"} name='FS'/>
  }

  renderTablespace(singData) {
    if (singData && singData.length) {
      return singData.map((item) => {
        return <NodeBar percentage={Math.floor(item.PERCENT)} a="#ffa80d" name={item.NAME}/>
      })
    }
  }

  render() {
    return (
      <div className={styles.body} style={{height: height * 0.22}}>
        <style>
          {`.ant-carousel .slick-vertical .slick-slide{
      height: ${height * 0.22}px !important
    }`}
        </style>
        {this.renderNodes()}
      </div>

    )
  }
}
