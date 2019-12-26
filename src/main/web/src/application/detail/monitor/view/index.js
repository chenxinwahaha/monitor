/**
 * FileName: index
 * Author:   wxxx
 * Date:     2018/10/29 9:58 AM
 */
import React, {Component} from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {ActivityIndicator} from 'antd-mobile';

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    const {dispatch} = this.props
    dispatch({type: 'detail/queryDetailById', payload: {id: window.sessionStorage.getItem("id")}}).then(
      () => this.queryHistory()
    )
  }

  queryHistory() {
    const {dispatch} = this.props
    const {detail} = this.props.detail
    console.log(detail)
    if (null !== detail && "" !== detail) {
      let jobExist = detail ? -1 !== (detail.code).indexOf("JOB_SCHEDULE") : false
      let otherExist = detail ? -1 !== (detail.code).indexOf("PUSH") ||
        -1 !== (detail.code).indexOf("PUBLISH") : false
      if (jobExist) {
        let parameter = {
          index: "job-schedule-event",
          jobId: detail.jobId ? detail.jobId : '',
          nodeId: detail.nodeId ? detail.nodeId : '',
          pageCount: 3,
          pageNo: 1
        }
        dispatch({type: 'detail/queryTransactionHistory', payload: parameter})
      } else if (otherExist) {
        let md5Parameter = {
          index: "transaction",
          md5: detail.md5 ? detail.md5 : null,
          pageCount: 3,
          pageNo: 1
        }
        dispatch({type: 'detail/queryTransactionHistory', payload: md5Parameter})
      }
    }
  }

  render() {
    const url = (window.location.href).split("detail")[0]
    const {historyInfo, detail} = this.props.detail
    // 当前错误是否该有历史记录
    let historyExist = detail ? -1 !== (detail.code).indexOf("JOB_SCHEDULE") ||
      -1 !== (detail.code).indexOf("PUSH") ||
      -1 !== (detail.code).indexOf("PUBLISH") : false
    return (
      <div className={styles.body}>
        {detail == null ? <div className={styles.mySpin}><ActivityIndicator toast text="请稍等"/></div> :
          detail != "" ?
            <div className={styles.show}>
              <div className={styles.topContent}>
                <a className={styles.toHomeField} href={url + "mobile"}>
                  <div className={styles.toHomeFieldLeft}>
                    <div><img src="../application/detail/detail_tohome.png"/></div>
                    <div className={styles.toHomeFont}>进入移动端监控中心</div>
                  </div>
                  <div className={styles.toHomeFieldRight}>
                    <img src="../application/detail/detail_rightarrow.png"/>
                  </div>
                </a>
              </div>
              {/*信息*/}
              <div className={styles.content}>
                <div className={styles.fieldTitle}>
                  <div style={{width: '90%'}}>信息</div>
                </div>
                <div className={styles.messageField}>
                  <div className={styles.messageContent}>
                    <div className={styles.rowContent}>
                      <div className={styles.rowLeft}>日期</div>
                      <div className={styles.rowRight}>{detail.time}</div>
                    </div>

                    <div className={styles.rowContent}>
                      <div className={styles.rowLeft}>消息类型</div>
                      <div className={styles.rowRight}>{detail.type == 'system' ? "系统" : "集成流"}</div>
                    </div>
                    {detail.nodeName ? <div className={styles.rowContent}>
                      <div className={styles.rowLeft}>节点名称</div>
                      <div className={styles.rowRight}>{detail.nodeName}</div>
                    </div> : void 0}
                    {
                      "flow" == detail.type ?
                        <div className={styles.rowContent}>
                          <div className={styles.rowLeft}>集成流</div>
                          <div className={styles.rowRight}>{detail.flowName + "(" + detail.flowId + ")"}</div>
                        </div> : void(0)
                    }
                    {
                      "flow" == detail.type && detail.flowType && "etl" !== detail.flowType ?
                        <div className={styles.rowContent}>
                          <div className={styles.rowLeft}>应用</div>
                          <div className={styles.rowRight}>{detail.appName + "(" + detail.appId + ")"}</div>
                        </div> : void(0)
                    }
                    {detail.jobType ? <div className={styles.messageLastRowContent}>
                      <div className={styles.messageLastRowLeft}>作业类型</div>
                      <div className={styles.messageLastRowRight}>{detail.jobType}</div>
                    </div> : void 0}
                    {detail.jobName ?
                      detail.jobType && detail.jobName.split("{,}").length == 1 ?
                        <div className={styles.messageLastRowContent}>
                          <div className={styles.messageLastRowLeft}>作业名称</div>
                          <div className={styles.messageLastRowRight}>{detail.jobName}</div>
                        </div> : <div>
                          <div className={styles.messageLastRowContent}>
                            <div className={styles.messageLastRowLeft}>作业集成流</div>
                            <div
                              className={styles.messageLastRowRight}>{detail.jobName.split("{,}")[0] + "(" + detail.jobName.split("{,}")[1] + ")"}</div>
                          </div>
                          <div className={styles.messageLastRowContent}>
                            <div className={styles.messageLastRowLeft}>作业应用</div>
                            <div
                              className={styles.messageLastRowRight}>{detail.jobName.split("{,}")[2] + "(" + detail.jobName.split("{,}")[3] + ")"}</div>
                          </div>
                        </div> : void 0}
                  </div>
                </div>
              </div>
              {/*历史记录*/}
              {
                historyExist && (historyInfo && historyInfo.length) ?
                  <div className={styles.historyContent}>
                    <div className={styles.fieldTitle}>
                      <div style={{width: '90%'}}>历史记录</div>
                    </div>

                    <div className={styles.historyMessageField}>
                      <div className={styles.historyMessageContent}>
                        {
                          historyInfo.map((item, index) => {
                            return (
                              "SUCCESS" == item.statusCode || "SUCCESS" == item.status ?
                                <div className={2 !== index ? styles.success : styles.lastSuccess}>
                                  <div className={styles.historyLeft}>
                                    <div className={styles.historySuccessPoint}></div>
                                    <div style={{color: '#60b258'}}>操作成功</div>
                                  </div>
                                  <div>{item.createDate ? item.createDate : item.responseDate}</div>
                                </div>
                                :
                                <div className={2 !== index ? styles.error : styles.lastError}>
                                  <div className={styles.historyLeft}>
                                    <div className={styles.historyErrorPoint}></div>
                                    <div style={{color: '#f81d22'}}>操作失败</div>
                                  </div>
                                  <div>{item.createDate ? item.createDate : item.responseDate}</div>
                                </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  </div> : void(0)
              }
              {/*排错*/}
              <div className={styles.content}>
                <div className={styles.fieldTitle}>
                  <div style={{width: '90%'}}>排错</div>
                </div>
                <div className={styles.erratumField}>
                  <div className={styles.erratumContent}>
                    <div className={styles.rowContent}>
                      <div className={styles.rowLeft}>错误编码</div>
                      <div className={styles.rowRight}>{detail.code}</div>
                    </div>
                    {detail.tips ? <div className={styles.exceptionRowContent}>
                      <div className={styles.exceptionRow}>
                        <div className={styles.exceptionRowLeft}>错误提示</div>
                        <div className={styles.exceptionRowRight}>
                          {detail.tips}
                        </div>
                      </div>
                    </div> : void 0}
                    {detail.exceptionType ?
                      <div className={styles.exceptionRowContent}>
                        <div className={styles.exceptionRow}>
                          <div className={styles.exceptionRowLeft}>错误类型</div>
                          <div className={styles.exceptionRowRight}>{detail.exceptionType}</div>
                        </div>
                      </div> : void 0}
                    {detail.exceptionMessage ?
                      <div className={styles.exceptionRowContent}>
                        <div className={styles.exceptionRow}>
                          <div className={styles.exceptionRowLeft}>错误消息</div>
                          <div className={styles.exceptionRowRight}>{detail.exceptionMessage}</div>
                        </div>
                      </div> : void 0}
                    {detail.exceptionMessageDetail ?
                      <div className={styles.exceptionMessageDetailRowContent}>
                        <div className={styles.exceptionMessageDetailRow}>
                          <div className={styles.exceptionDetailRowLeft}>错误详情</div>
                          <div className={styles.exceptionDetailRowRight}>
                            <pre>{detail.exceptionMessageDetail}</pre>
                          </div>
                        </div>
                      </div> : void 0}
                  </div>
                </div>
              </div>
            </div> : <div className={styles.errorPage}>
              <div className={styles.part}>
                <img src="../application/mobile/no_data.png"/>
                <span>暂时未查到数据</span>
              </div>
            </div>}
      </div>
    )
  }
}

export default connect((detail) => (detail))(Index)

