/**
 * FileName: index
 * Author:   wxxx
 * Date:     2018/10/16 7:14 PM
 */
import React, {Component} from 'react'
import {connect} from 'dva'
import styles from './index.less'
import FoldLine from "../../../component/FoldLine/index"

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const {selectDate, todayTransactionInfo, yesterdayTransactionInfo, thisWeekTransactionInfo} = this.props
    return (
      <div className={styles.content}>
        {
          "今日" == selectDate && todayTransactionInfo.length ?
            <FoldLine dataSource={todayTransactionInfo}
                      code={true}
                      type={'今日'}
                      xAxisData={['0', '3', '6', '9', '12', '15', '18', '21', '24']}
                      lineColor={"#19c1d5"}
            />
            : void(0)
        }
        {
          "昨日" == selectDate && yesterdayTransactionInfo.length ?
            <FoldLine dataSource={yesterdayTransactionInfo}
                      code={true}
                      type={'昨日'}
                      xAxisData={['0', '3', '6', '9', '12', '15', '18', '21', '24']}
                      lineColor={"#f3a93d"}
            />
            : void(0)
        }
        {
          "本周" == selectDate && thisWeekTransactionInfo.length ?
            <FoldLine dataSource={thisWeekTransactionInfo}
                      code={true}
                      type={'本周'}
                      xAxisData={['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']}
                      lineColor={"#844dc5"}
            />
            : void(0)
        }
      </div>
    )
  }
}

export default connect(({mobile, appModel}) => ({mobile, appModel}))(Index)
