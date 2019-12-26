/**
 * Created by 陈鑫 on 2018/4/12.
 */
import React, {Component} from 'react'
import {connect} from 'dva'
import NodeBar from "../nodeBar/index"
import styles from './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch({type: 'node/queryMobileElasticSearchHealth'})
  }

  renderOS(value) {
    return <NodeBar percentage={value} a={value > 80 || value == 80 ? "#ffa80d" : "#3e9cf7"} name='RAM'/>
  }

  renderJVM(value) {
    return <NodeBar percentage={value} a={value > 80 || value == 80 ? "#ffa80d" : "#33ccff"} name='JVM'/>
  }

  renderCPU(value) {
    return <NodeBar percentage={value} a={value > 80 || value == 80 ? "#ffa80d" : "#79e779"} name='CPU'/>
  }

  renderFS(value) {
    return <NodeBar percentage={value} a={value > 80 || value == 80 ? "#ffa80d" : "#19dc7c"} name='FS'/>
  }


  render() {
    const {esHealth} = this.props
    return (
      <div className={styles.total}>
        <div className={styles.title}>
          <div className={styles.content}>
            <div className={styles.left}>
              <img src="./application/mobile/node/ElasticSearch.png"/>
              <span className={styles.node}>ElasticSearch</span>
            </div>
            <div className={styles.right}>
              版本&nbsp;{esHealth && esHealth.VERSION ? esHealth.VERSION : void 0}
            </div>
          </div>
        </div>
        <div className={styles.lineBars}>
          {esHealth && esHealth.RAM ? this.renderOS(esHealth.RAM) : void(0)}
          {esHealth && esHealth.JVM ? this.renderJVM(esHealth.JVM) : void(0)}
          {esHealth && esHealth.CPU ? this.renderCPU(esHealth.CPU) : void(0)}
          {esHealth && esHealth.FS ? this.renderFS(esHealth.FS) : void(0)}
        </div>
      </div>
    )

  }
}

export default connect(({node}) => ({node}))(Index)
