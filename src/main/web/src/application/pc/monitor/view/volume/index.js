/**
 * Created by 陈鑫 on 2018/4/11.
 */
import React, {Component} from 'react'
import styles from './index.less'

const width = document.body.clientWidth
const height = document.body.clientHeight
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      average: 0,
      beforeCount: 0
    }
  }

  componentDidMount() {
    // const _this = this
    // setInterval(() => {
    //   const {tradingCount} = _this.props
    //   const {beforeCount} = _this.state
    //   let value = (tradingCount - beforeCount) / 60
    //   _this.setState({
    //     average: parseInt(value),
    //     beforeCount: tradingCount
    //   })
    // }, 60000)
  }

  render() {
    const {tradingCount, datePeak} = this.props
    const {average} = this.state
    return (
      <div className={styles.body} style={{backgroundImage: 'url(application/img/function_bg.png)'}}>
        <div className={styles.top} style={{height: height * 0.015}}>
          <span>交易量</span>
        </div>
        <div className={styles.bottom}>
          <div className={styles.left}>
            <div className={styles.leftTop}>
              <span>今日交易量</span>
            </div>
            <div id='totalCount' className={styles.leftBottom}>{tradingCount ? tradingCount : 0}</div>
          </div>
          <div className={styles.right}>
            <div className={styles.rightTop}>
              <span>最高峰每秒</span>
            </div>
            <div className={styles.rightBottom}>{datePeak ? datePeak : 0}</div>
          </div>
        </div>
      </div>
    )
  }
}
