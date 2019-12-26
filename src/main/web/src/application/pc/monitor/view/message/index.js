/**
 * Created by 陈鑫 on 2018/4/11.
 */
import React, {Component} from 'react'
import styles from './index.less'

const bodyHeight = document.body.clientHeight
const height = (1 - 0.0325 * 2) * 0.275 * 0.82 * bodyHeight - 2//减去2是因为border占2px
let rectMargin = 0.006 * bodyHeight
const rectHeight = (height - 7 * rectMargin) / 6
let animate = height / 6
const width = document.body.clientWidth
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }

  renderNewItem() {
    return (
      <div id="itemContainer" className={styles.itemContainer} style={{top: -rectHeight}}>
      </div>
    )
  }

  render() {
    const {displayCode} = this.props
    return (
      <div className={displayCode == 1 ? styles.body : styles.displayNone}
           style={{backgroundImage: 'url(application/img/function_bg.png)'}}>
        <div className={styles.top} style={{height: bodyHeight * 0.015}}>
          <span>消息</span>
        </div>
        <div className={styles.platformExceptionDown}>
          {this.renderNewItem()}
          <div className={styles.platformExceptionDownContainDiv}/>
        </div>
      </div>
    )
  }
}
