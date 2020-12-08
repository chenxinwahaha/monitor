/*
 * Created by dhl 2018  on 6/1
 */
import React, {Component} from 'react'
import {Modal, List, Button, WhiteSpace, WingBlank, Toast, ActivityIndicator} from 'antd-mobile';
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import styles from './index.less'
import moment from 'moment'
import DataInfo from '../../../component/DataList/index.js'
import DataModal from '../../../component/DataModal/index'

const Item = List.Item;
const Brief = Item.Brief;


class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectBar: 'flow',
      modalVisible: false,
      modalContent: [],
      timeStatus: "0"
    }
  }

  selectColor(name) {
    const {selectBar} = this.state
    if (name == selectBar) {
      let color = {color: "#0085e8", borderBottom: '#0085e8', borderStyle: 'solid', borderWidth: '0.2rem'}
      return color
    }
  }

  componentDidMount() {
  }

  componentWillMount() {
    const {dispatch} = this.props
    dispatch({type: 'mobile/queryWorkList'})
    dispatch({type: 'mobile/queryNodeInfo'})
    dispatch({
      type: 'mobile/queryJobScheduleError', callback: () => {
        this.setState({timeStatus: "1"})
      }
    })
  }

  componentWillUnmount() {
    clearTimeout((this.timeoutId))
  }

  checkTime(i) { //将0-9的数字前面加上0，例1变为01
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  calculateTime(record) {
    let result = ''
    let time = record.COMPLETE_DATE
    let lastTime = record.JOB_LAST_RUN_TIME
    let valueDate = new Date(time)
    let timestamp = new Date(lastTime)
    let day = Math.floor((valueDate.getTime() - timestamp.getTime()))
    if (day < 0) {
      return '作业失败'
    }
    var days = parseInt(day / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
    var hours = parseInt(day / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
    var minutes = parseInt(day / 1000 / 60 % 60, 10);//计算剩余的分钟
    var seconds = parseInt(day / 1000 % 60, 10);//计算剩余的秒数
    if (days != '00') {
      result = result + days + "天"

    }
    if (hours != '00') {
      result = result + hours + "小时"

    }
    if (minutes != '00') {
      result = result + minutes + "分"

    }
    if (seconds != '00') {
      result = result + seconds + "秒"
    }

    let m1 = moment(record.COMPLETE_DATE),
      m2 = moment(record.JOB_LAST_RUN_TIME)
    let du = moment.duration(m1 - m2, 'ms')
    let hour = du.get('hours')
    let mins = du.get('minutes')
    let ss = du.get('seconds')
    if (hour < 0 || mins < 0 || ss < 0) {
      return '作业失败'
    } else if (hour == 0 && mins == 0) {
      return ss + '秒'
    } else if (hour == 0 && mins != 0) {
      return mins + '分' + ss + '秒'
    } else {
      return hour + '时' + mins + '分' + ss + '秒'
    }
  }


  timeAgo(val) {
    let nowDate = new Date();
    let replyDate = new Date(val);
    let diffSeconds = (nowDate.getTime() - Number(replyDate.getTime())) / 1000;
    let years = 365 * 24 * 60 * 60;
    let months = 30 * 24 * 60 * 60;
    let days = 24 * 60 * 60;
    let hours = 60 * 60;
    let minutes = 60;
    let seconds = 1;
    if (diffSeconds < seconds) {
      return '1秒以前'
    } else if (seconds <= diffSeconds && diffSeconds < minutes) {
      return Math.floor(diffSeconds / seconds) + '秒前'
    } else if (minutes <= diffSeconds && diffSeconds < hours) {
      return Math.floor(diffSeconds / minutes) + '分钟前'
    } else if (hours < diffSeconds && diffSeconds < days) {
      return Math.floor(diffSeconds / hours) + '小时前'
    } else if (days < diffSeconds && diffSeconds < months) {
      return Math.floor(diffSeconds / days) + '天前'
    } else if (months < diffSeconds && diffSeconds < years) {
      return Math.floor(diffSeconds / months) + '个月前'
    } else {
      return Math.floor(diffSeconds / years) + '年前'
    }
  }

  transformTime(time) {
    // let times=new Date(time).format("YY/MM/DD HH:MM:SS")
    // console.log(times,'times')
    // console.log(times,'time')
    // let valueDate = new Date(time)
    // let newDate = new Date()
    // newDate.setTime(valueDate.getTime())
    // return newDate.toLocaleString()
    // console.log(newDate.toLocaleString(),'newDate.toLocaleString()')
    // console.log(moment(time).format('YYYY-MM-DD HH:mm:ss')  ,'time')
    return moment(time).format('YYYY-MM-DD HH:mm:ss')
  }

  renderJob(record) {
    const _this = this
    if (record) {
      if (record.LAST_DATE && !record.LAST_STRING) {
        return _this.transformTime(record.LAST_DATE)
      }
      else if (!record.LAST_DATE && record.LAST_STRING) {
        return record.LAST_STRING
      }
    }
    return ''
  }

  timeLength(record) {
    let time = record.COMPLETE_DATE
    let lastTime = record.JOB_LAST_RUN_TIME
    let valueDate = new Date(time)
    let timestamp = new Date(lastTime)
    let day = Math.floor((valueDate.getTime() - timestamp) / 1000)
    return day + '秒'
  }


  clickData(item) {
    const {modalVisible, modalContent} = this.state
    const {jobScheduleError} = this.props.mobile
    let nextTime = this.showNextTime(item)
    modalContent.push({title: '名称', content: item.TYPE_CODE === 'system' ? item.NAME : item.IF_NAME, type: '0'})
    modalContent.push({title: '当前运行节点', content: item.NODE_NAME, type: '0'})
    modalContent.push({title: '最后运行时间', content: this.transformTime(item.JOB_LAST_RUN_TIME), type: '0'})
    modalContent.push({title: '时长', content: this.calculateTime(item), type: '0'})
    modalContent.push({title: '作业变量', content: this.renderJob(item), type: '0'})
    modalContent.push({title: '下次执行时间', content: nextTime, type: '0'})
    modalContent.push({title: '状态', content: item.STATUS_CODE == 'success' ? '正常' : '异常', type: '1'})
    if (item.STATUS_CODE !== 'success') {
      let errorData = jobScheduleError.filter((item) => item.sourceAsMap.id === item.ID)
      if (errorData && errorData.length > 0) {
        // modalContent.push({title:'error',content:errorData[0]})
        modalContent.push({
          title: '异常',
          content: "",
          type: '3'
        })
      }
    }
    this.setState({modalContent}, () => {
      this.setState({modalVisible: !modalVisible})
    })
  }

  showNextTime(record) {
    const {schedulerList} = this.props.mobile
    if (schedulerList && schedulerList.length) {
      let list = schedulerList.filter((item) => item && item.code && item.code == 1)
      if (list && list.length) {
        let selectInfo = list.filter((it) => (it.payload) && (it.payload).length ? (it.payload)[0].nodeId == record.NODE_ID : false)[0]
        if (selectInfo && selectInfo.payload) {
          return (selectInfo.payload)[0].nextFireTime
        }
      }
    }
    return ''
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

  render() {
    const {workList, jobScheduleError} = this.props.mobile
    const {selectBar, modalVisible, modalContent} = this.state
    let filWorkList = workList.filter((item) => item.TYPE_CODE == selectBar)
    let pictureUrl = "./application/mobile/timing_operation_circle.png"
    return (
      <div className={styles.content}>
        <div className={styles.select}>
          <div className={styles.bar}>
            <div className={styles.name} style={{color: selectBar === 'flow' ? '#0085e8' : '#000000'}} onClick={() => {
              this.setState({selectBar: "flow"})
            }}>集成流
            </div>
            <div className={selectBar === 'flow' ? styles.line : styles.line1}></div>
          </div>
          <div className={styles.bar}>
            <div className={styles.name} style={{color: selectBar === 'system' ? '#0085e8' : '#000000'}}
                 onClick={() => {
                   this.setState({selectBar: "system"})
                 }}>系统
            </div>
            <div className={selectBar === 'system' ? styles.line : styles.line1}></div>
          </div>
        </div>
        <div className={styles.data}>
          {filWorkList && filWorkList.length > 0 ? filWorkList.map((item, index) => {
            let name, status, current, time
            name = item.TYPE_CODE === 'system' ? item.NAME : item.IF_NAME
            status = item.STATUS_CODE === 'success' ? '正常' : "异常"
            current = "当前运行的节点: " + item.NODE_NAME
            time = this.calculateTime(item)
            return <div key={index} onClick={() => {
              this.clickData(item)
            }}>
              <DataInfo name={name} status={status} current={current} time={time} pictureUrl={pictureUrl}/>
            </div>
          }) : this.setTime()}
        </div>
        <DataModal modalVisible={modalVisible} content={modalContent} title='数据详情' closeModal={() => {
          this.setState({modalVisible: !modalVisible, modalContent: []})
        }}/>
      </div>
    )
  }
}

export default connect((mobile) => (mobile))(Index)
