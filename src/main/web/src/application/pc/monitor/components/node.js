/**
 * Created by 陈鑫 on 2018/4/4.
 */
import React, {Component} from 'react'
import styles from './node.less'

const width = document.body.clientWidth
const height = document.body.clientHeight

export default class Node extends Component {
  constructor(props) {
    super(props)
    this.state = {
      i: 0,
    }
  }

  componentWillMount() {

  }

  returnImgUrl(concurrentNum) {
    let imgUrl = "application/img/node_blue.png"
    if (concurrentNum > 10 && concurrentNum < 20) {
      imgUrl = "application/img/node_yellow.png"
    }
    else if (concurrentNum > 20) {
      imgUrl = "application/img/node_red.png"
    }
    return imgUrl
  }

  clickNode() {
    const {i} = this.state
    this.refs.node.style.transform = '1s'
    this.refs.node.style.msTransform = '1s'
    /* IE 9 */
    this.refs.node.style.mozTransform = '1s'
    /* Firefox */
    this.refs.node.style.oTransform = '1s'
    /* Opera */
    this.refs.node.style.webkitTransition = '1s'
    /* Safari 和 Chrome */

    this.refs.node.style.transform = 'rotate(' + (i + 72) + 'deg)'
    this.refs.node.style.msTransform = 'rotate(' + (i + 72) + 'deg)'
    this.refs.node.style.mozTransform = 'rotate(' + (i + 72) + 'deg)'
    this.refs.node.style.oTransform = 'rotate(' + (i + 72) + 'deg)'
    this.refs.node.style.webkitTransform = 'rotate(' + (i + 72) + 'deg)'
    this.setState({
      i: i + 72
    })
  }

  render() {
    const {concurrentNum, node} = this.props
    this.returnImgUrl()
    return (
      <div className={styles.node} style={{width: width * 0.051, height: width * 0.051}}>
        <img ref='node' className={styles.nodeImg} src={this.returnImgUrl(concurrentNum)}
             style={{width: width * 0.051, height: width * 0.051}}/>
        <div className={styles.nodeText} style={{
          width: width * 0.051,
          // height:width*0.028,
          paddingLeft: width * 0.051 * 0.272,
          paddingRight: width * 0.051 * 0.272
        }}>{node}</div>
      </div>
    )
  }
}

