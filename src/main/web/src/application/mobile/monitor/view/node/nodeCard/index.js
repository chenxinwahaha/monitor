/**
 * Created by 陈鑫 on 2018/4/12.
 */
import React, {Component} from 'react'
import {connect} from 'dva'
import NodeBar from "../nodeBar/index"
import {Icon, Spin} from 'antd'
import styles from './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  /* componentDidMount() {
     const {dispatch} = this.props
     dispatch({type: 'node/queryMobileNodeInfo'})
   }*/

  renderJVM(value) {
    if (value.jvm) {
      let num = parseInt(value.jvm.usage * 100 / value.jvm.total)
      return <NodeBar percentage={num} a={num > 80 || num == 80 ? "#ffa80d" : "#3e9cf7"} name="JVM"/>
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
                                           name={item.name ? item.name : "磁盘"} key={index}/> : void (0)
      })
    }
  }

  renderThread(value) {
    if (value.thread) {
      let num = parseInt(value.thread.size * 100 / 2000)
      return <NodeBar percentage={num} a={num > 80 || num == 80 ? "#ffa80d" : "#19dc7c"} name="线程"/>
    }
  }

  renderSystemLoad(value) {
    if (value.systemload) {
      let num = parseInt(value.systemload)
      return <NodeBar percentage={num} a={num > 80 || num == 80 ? "#ffa80d" : "#66ccff"} name="CPU"/>
    }
  }

  nodeTranscationNum(nodeId) {
    const {nodeTranscation} = this.props.node
    let tans = JSON.parse(nodeTranscation)
    let list = null !== tans ? tans.aggregations.trem.buckets : null
    if (list && list.length > 0) {
      let filter = list.filter((item) => item.key == nodeId)
      if (filter && filter.length > 0) {
        return filter[0].doc_count
      } else {
        return "0"
      }
    } else {
      return "0"
    }
  }

  renderData(nodeIf) {
    if (nodeIf.value) {
      return (<div className={styles.lineBars}>
        <div className={styles.bottom}>
          {nodeIf.value ? this.renderSystemLoad(nodeIf.value) : void 0}
          {nodeIf.value ? this.renderJVM(nodeIf.value) : void 0}
          {nodeIf.value ? this.renderRAM(nodeIf.value) : void 0}
          {nodeIf.value ? this.renderThread(nodeIf.value) : void 0}
          {nodeIf.value ? this.renderDisk(nodeIf.value) : void 0}
        </div>
      </div>)
    } else if (nodeIf.error) {
      return (<div className={styles.noData}>
        <Icon type="exclamation-circle-o"/><span className={styles.message}>此节点异常</span>
      </div>)
    }
    else {
      return (<div className={styles.noData1}>
        <Spin/><span className={styles.message}>正在加载中</span>
      </div>)
    }
  }

  render() {
    const {nodeIf} = this.props
    return (
      <div className={styles.total}>
        <div className={styles.title}>
          <div className={styles.content}>
            <div className={styles.left}>
              <div className={styles.top}>
                {nodeIf.error ? <img src="./application/mobile/NodeRed.png"/> :
                  <img src="./application/mobile/node/node.png"/>}
                <div className={styles.node}>{nodeIf.name}</div>
              </div>
              <div className={styles.bottom}>
                <span className={styles.count}>版本&nbsp;</span>
                <span>{nodeIf.version ? nodeIf.version : ''}</span>
              </div>
            </div>
            {nodeIf.error ? <div className={styles.rightError}>
              <span className={styles.number}>{this.nodeTranscationNum(nodeIf.id)}</span>
              <span className={styles.count}>当日累计交易量</span>
            </div> : <div className={styles.right}>
              <span className={styles.number}>{this.nodeTranscationNum(nodeIf.id)}</span>
              <span className={styles.count}>当日累计交易量</span>
            </div>}

          </div>
        </div>
        {
          this.renderData(nodeIf)
        }
      </div>
    )
  }
}

export default connect(({node}) => ({node}))(Index)

