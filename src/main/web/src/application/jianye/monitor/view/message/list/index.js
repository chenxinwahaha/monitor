/**
 * Created by 陈鑫 on 2018/6/5.
 */
import React, {Component} from 'react'
import styles from './index.less'
import {connect} from 'dva'
import $ from 'jquery';
import DataModal from '../../../component/DataModal/index'
import {Scrollbars} from 'react-custom-scrollbars';

const pageCount = 10
import {List, Toast, ActivityIndicator} from 'antd-mobile';

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      modalContent: [],
      timeStatus: "0",
      pageNo: 1,
      codeName: '',
    }
  }

  orderScroll() {
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch({
      type: "appModel/loadAllApp", callback: () => this.setState({
        timeStatus: '1'
      })
    })
    dispatch({type: "appModel/queryNodeList"})
    dispatch({type: "appModel/querySieIfList"})
  }

  onScrollHandle(top) {
    const {dispatch} = this.props
    const {errorList, num} = this.props.mobile
    if (top >= 0.995) {
      const {pageNo} = this.state
      this.setState({pageNo: pageNo + 1})
      if (errorList && errorList.length && errorList[0].sourceAsMap && errorList[0].sourceAsMap.code) {
        dispatch({
          type: 'mobile/queryMonitorMessageByScroll',
          payload: {pageNo: pageNo + 1, pageCount: 10, codeId: errorList[0].sourceAsMap.code},
          callback: () => {
          }
        })
      }
    }
  }

  dateFormat(data) {
    let subDate = data.substring(5, data.length)
    let spiltDate = subDate.split(" ")
    return spiltDate
  }

  clickData(item) {
    const {modalVisible} = this.state
    const {nodeList, sieIfList, appList} = this.props.appModel
    //let message = JSON.parse(JSON.stringify(item.message));
    // let flowId=message.extendValues.flowId

    let node = nodeList && nodeList.length > 0 ? nodeList.filter((node) => node.id === item.nodeId) : void(0)
    let sieIf = sieIfList && sieIfList.length > 0 ? sieIfList.filter((sieIf) => sieIf.id === item.flowId) : void(0)
    let app = appList && appList.length > 0 ? appList.filter((app) => app.id === item.appId) : void(0)
    let errorContent = item.exceptionMessageDetail ? item.exceptionMessageDetail : item.tips
    let contentList = []

    contentList.push({title: '节点', content: node.length > 0 ? node[0].name : ''})
    if (item.flowId && "SYSTEM" != item.flowId) {
      contentList.push({title: '集成流', content: sieIf.length > 0 ? sieIf[0].name : ''})
    }
    if (item.appId && "SYSTEM" != item.appId) {
      contentList.push({title: '应用', content: app.length > 0 ? app[0].name : ''})
    }
    contentList.push({title: '发送时间', content: item.time})
    contentList.push({title: '错误提示', content: item.tips ? item.tips : ''})
    contentList.push({title: '错误类型', content: item.exceptionType ? item.exceptionType : ''})
    contentList.push({title: '错误消息', content: item.exceptionMessage ? item.exceptionMessage : ''})
    contentList.push({title: '错误详情', content: ''})
    contentList.push({title: 'error', content: errorContent})
    this.setState({modalContent: contentList, codeName: item.codeName}, () => {
      this.setState({modalVisible: !modalVisible})
    })
  }

  loadItems() {
    $("#content").scroll(function () {
    });
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

  render() {
    const {errorList, num} = this.props.mobile
    const {modalContent, modalVisible, pageNo, codeName} = this.state
    return (
      <div className={styles.total}>
        <div className={styles.title}>
          <div className={styles.countInfo}>
            <div className={styles.num}>{num}</div>
            <div className={styles.info}>今日信息发送量</div>
          </div>
        </div>

        <div className={styles.content} id="content">
          <Scrollbars
            onScroll={() => {
            }}
            onScrollFrame={(e) => {
              this.onScrollHandle(e.top)
            }}
          >
            {errorList && errorList.length > 0 ? errorList.map((item, index) => {
              // if (index < (pageNo * pageCount - 1)) {
              let exceptionTypeString = item.sourceAsMap.exceptionType ? item.sourceAsMap.exceptionType.toString() : ""
              let tipsString = item.sourceAsMap.tips ? item.sourceAsMap.tips.toString() : ""
              let str = tipsString + exceptionTypeString
              return (
                <div className={styles.data} key={index} onClick={() => {
                  this.clickData(item.sourceAsMap)
                }}>
                  <div className={styles.info}>
                    <div className={styles.left}>
                      <div className={styles.date}>{this.dateFormat(item.sourceAsMap.time)[0]}</div>
                      <div className={styles.date}>{this.dateFormat(item.sourceAsMap.time)[1]}</div>
                    </div>
                    <div className={styles.right}>
                      <div className={styles.data}>
                        {/*<span className={styles.node}>[{item.sourceAsMap.appId}]</span>*/}
                        <div className={styles.exception}>

                          <span
                            className={styles.node}>[{item.sourceAsMap.nodeId ? item.sourceAsMap.nodeId : "sieMonitor"}]</span>
                          <span>
                            {/*判断有没有throwableMessage，有的话就用throwableMessage，没有就用exception
                            分别判断throwableMessage，exception字符长度，超过47部分显示...*/}
                            {
                              str ? (str.length >= 47 ? str.substring(0, 46) + '...' : str.substring(0, str.length)) : ""
                            }
                              </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
              // }
            }) : this.setTime()}
          </Scrollbars>
        </div>

        <DataModal modalVisible={modalVisible}
                   title={codeName}
                   content={modalContent}
                   closeModal={() => {
                     this.setState({modalVisible: !modalVisible, modalContent: []})
                   }}/>
      </div>

    )
  }
}

export default connect(({mobile, appModel}) => ({mobile, appModel}))(Index)
