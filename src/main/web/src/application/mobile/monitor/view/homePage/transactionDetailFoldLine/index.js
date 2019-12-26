/**
 * FileName: index
 * Author:   wxxx
 * Date:     2018/10/19 8:56 AM
 */
import React, {Component} from 'react'
import {connect} from 'dva'
import styles from './index.less'
import FoldLine from "../../../component/FoldLine";


class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const {dispatch} = this.props
    const {selectFlow, selectApp, selectType} = this.props.mobile
    {
      "if" == selectType ?
        dispatch({
          type: "mobile/queryTransactionByDateAndField", payload: {"type": 1, "key": "flowId", "value": selectFlow}
        }).then(
          dispatch({
            type: "mobile/queryTransactionByDateAndField", payload: {"type": 2, "key": "flowId", "value": selectFlow}
          })
        ).then(
          dispatch({
            type: "mobile/queryTransactionByDateAndField", payload: {"type": 3, "key": "flowId", "value": selectFlow}
          })
        ) :
        dispatch({
          type: "mobile/queryTransactionByDateAndField", payload: {"type": 1, "key": selectType, "value": selectApp}
        }).then(
          dispatch({
            type: "mobile/queryTransactionByDateAndField", payload: {"type": 2, "key": selectType, "value": selectApp}
          })
        ).then(
          dispatch({
            type: "mobile/queryTransactionByDateAndField", payload: {"type": 3, "key": selectType, "value": selectApp}
          })
        )
    }
  }

  componentWillUnmount() {
    const {dispatch} = this.props
    dispatch({
      type: "mobile/setState",
      payload: {
        singleTodayTransactionInfo: [], singleYesterdayTransactionInfo: [],
        singleThisWeekTransactionInfo: [], name: ''
      }
    })
  }


  render() {
    const {
      singleTodayTransactionInfo, singleYesterdayTransactionInfo,
      singleThisWeekTransactionInfo, name
    } = this.props.mobile

    return (
      <div className={styles.total}>
        <div className={styles.title}>
          <div className={styles.titleText}>{name.name}</div>
        </div>
        <div className={styles.today}>
          {singleTodayTransactionInfo.length ?
            <FoldLine dataSource={singleTodayTransactionInfo}
                      code={false}
                      titleText={"今日"}
                      type={'今日'}
                      xAxisData={['0', '3', '6', '9', '12', '15', '18', '21', '24']}
                      lineColor={"#19c1d5"}
            />
            : void 0}
        </div>
        <div className={styles.yesterday}>
          {singleYesterdayTransactionInfo.length ?
            <FoldLine dataSource={singleYesterdayTransactionInfo}
                      code={false}
                      titleText={"昨日"}
                      type={'昨日'}
                      xAxisData={['0', '3', '6', '9', '12', '15', '18', '21', '24']}
                      lineColor={"#f3a93d"}
            />
            : void 0}
        </div>
        <div className={styles.thisWeek}>
          {singleThisWeekTransactionInfo.length ?
            <FoldLine dataSource={singleThisWeekTransactionInfo}
                      code={false}
                      titleText={"本周"}
                      type={'本周'}
                      xAxisData={['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']}
                      lineColor={"#844dc5"}
            />
            : void 0}
        </div>
      </div>
    )
  }
}

export default connect(({mobile, appModel}) => ({mobile, appModel}))(Index)
