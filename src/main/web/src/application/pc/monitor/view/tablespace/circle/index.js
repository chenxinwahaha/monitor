/**
 * Created by 陈鑫 on 2018/4/12.
 */
import React, {Component} from 'react'
import styles from './index.less'

require('jquery-circle-progress')
var $ = require('jquery')
const circleHeigth = window.document.body.clientHeight * 0.1
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const {circleId, value} = this.props
    if (value > 0.8 || value == 0.8) {
      $(`#${circleId}`).circleProgress({
        size: circleHeigth,
        value: value,
        thickness: 10,
        fill: {gradient: ["#990033", "#CC0033"]},
        lineCap: "round",
        emptyFill: "#565a71"
      });
    }
    else if (value > 0.5) {
      $(`#${circleId}`).circleProgress({
        size: circleHeigth,
        value: value,
        thickness: 10,
        fill: {gradient: ["#FFCC00", "#FF6600"]},
        lineCap: "round",
        emptyFill: "#565a71"
      })
    }
    else {
      $(`#${circleId}`).circleProgress({
        size: circleHeigth,
        value: value,
        thickness: 10,
        fill: {gradient: ["#00ffff", "#0000ff"]},
        lineCap: "round",
        emptyFill: "#565a71"
      })
    }
  }

  render() {
    const {circleId, value} = this.props
    return (
      <div className={styles.body}>
        <div id={circleId} className={styles.top} style={{heigth:circleHeigth}}></div>
        <span className={styles.bottom}>{circleId}</span>
      </div>
    )
  }
}
