/**
 * Created by 陈鑫 on 2018/5/31.
 */
import React, {Component} from 'react'
import styles from './index.less'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import moment from 'moment'
import {List, Toast, ActivityIndicator} from 'antd-mobile';

const list = [{
  code: 'FLOW_LOAD_ERROR',
  name: '集成流加载失败',
  url: './application/mobile/integrated_flow_loading_failure.png'
}, {
  code: 'INITIALIZE_ELASTICSEARCH_INDEX_ERROR',
  name: '初始化ES索引失败',
  url: './application/mobile/data_tracking.png'
}, {
  code: 'JOB_SCHEDULE_ERROR',
  name: '定时作业调度失败',
  url: './application/mobile/timing_operation.png'
}, {code: 'REPUBLISH_ERROR', name: '重新发布失败', url: './application/mobile/publish_queue.png'}, {
  code: 'REPUSH_ERROR',
  name: '重新推送失败',
  url: './application/mobile/push_queue.png'
}]

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timeStatus: "0"
    }
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch({
      type: 'mobile/queryMonitorMessage', callback: () => this.setState({
        timeStatus: '1'
      })
    })
  }

  clickItem(value) {
    const {dispatch} = this.props
    dispatch({type: 'mobile/queryTodayMessageNum', payload: {codeId: value}})
    dispatch({
      type: 'mobile/queryMonitorMessageByScroll', payload: {pageNo: 1, pageCount: 10, codeId: value}, callback: () => {
        dispatch(routerRedux.push({
          pathname: 'errorList',
          query: {},
        }));
      }
    })
  }

  sortTime() {
    return function (a, b) {
      let time1 = new Date(a.sourceAsMap.time).getTime()
      let time2 = new Date(b.sourceAsMap.time).getTime()
      return time2 - time1
    }
  }

  imgUrl(item) {
    if (item == 'FLOW_LOAD_ERROR') {
      return './application/mobile/integrated_flow_loading_failure.png'
    } else if (item == 'INITIALIZE_ELASTICSEARCH_INDEX_ERROR') {
      return './application/mobile/initialize_elasticsearch_index_error.png'
    } else if (item == "JOB_SCHEDULE_ERROR") {
      return './application/mobile/job_schedule_error.png'
    } else if (item == 'REPUBLISH_ERROR') {
      return './application/mobile/republish_error.png'
    } else if (item == 'REPUSH_ERROR') {
      return './application/mobile/repush_error.png'
    } else if (item == 'ERROR_PUBLISH') {
      return './application/mobile/publish_error.png'
    } else if (item == 'ERROR_PUSH') {
      return './application/mobile/push_error.png'
    } else if (item == 'ERROR_REQUEST') {
      return './application/mobile/error_request.png'
    } else if (item == 'ERROR_SERVER') {
      return './application/mobile/error_server.png'
    } else {
      return './application/mobile/other_error.png'
    }
  }

  getTwoCharacterCodeName(codeName) {
    return null !== codeName ? codeName.slice(0, 2) : void (0)
  }

  componentWillUnmount() {
    clearTimeout((this.timeoutId))
  }

  setTime() {
    const {timeStatus} = this.state
    if (timeStatus === "0") {
      return <div><ActivityIndicator toast text="请稍等"/></div>
    } else {
      return (
        <div className={styles.errorPage}>
          <div className={styles.part}>
            <img src="./application/mobile/no_data.png"/>
            <span>暂时未查到数据</span>
          </div>
        </div>)
    }
  }

  countDateFromNow(time) {
    if ("几秒前" == time) {
      return "刚刚"
    } else {
      return time
    }
  }

  render() {
    const {messageList} = this.props.mobile
    let dataGroup = []
    let dataId = []
    if (messageList && messageList.length) {
      messageList.map((item) => {
        dataGroup.push(item.latestMessage)
      })
    }
    dataGroup.sort(function (a, b) {
      return Date.parse(b.sourceAsMap.time.replace(/\-/g, '/')) - Date.parse(a.sourceAsMap.time.replace(/\-/g, '/'));//兼容
      //return Date.parse(b.sourceAsMap.date) - Date.parse(a.sourceAsMap.date);//时间正序,ios无效
    });
    return (
      <div className={styles.body}>
        {dataGroup && dataGroup.length ? dataGroup.map((item, index) => {
          return <div className={styles.item} key={index} onClick={() => this.clickItem(item.sourceAsMap.code)}>
            <img className={styles.img} src={this.imgUrl(item.sourceAsMap.code)}/>
            <div className={styles.context}>
              <div className={styles.contextTop}>
                <div
                  className={styles.title}>{item.sourceAsMap.code == 'INITIALIZE_ELASTICSEARCH_INDEX_ERROR' ? '初始化ES索引失败' : item.sourceAsMap.codeName}</div>
                <div
                  style={{color: '#999999'}}>{this.countDateFromNow(moment(item.sourceAsMap.time).fromNow())}
                </div>
              </div>
              <div className={styles.exception}
                   style={{color: '#999999'}}>{item.sourceAsMap.tips ? item.sourceAsMap.tips : item.sourceAsMap.exceptionMessage}</div>
            </div>
          </div>
        }) : this.setTime()}

      </div>
    )
  }
}

export default connect((mobile) => (mobile))(Index)
