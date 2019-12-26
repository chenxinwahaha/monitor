/**
 * FileName: index
 * Author:   wxxx
 * Date:     2018/11/13 9:09 AM
 */
import React, {Component} from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {ActivityIndicator} from 'antd-mobile';
import {Icon} from 'antd'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      codeNameMap: {},
      messageKeyList: [],
      nameNumMap: {}
    }
  }

  componentWillMount() {
    const {dispatch} = this.props
    dispatch({type: 'yesterday/queryYesterdayDetailById', payload: {id: window.sessionStorage.getItem("id")}})
    dispatch({
      type: 'mobile/queryMonitorMessage', callback: () => {
      }
    }).then(() => {
      //获取所有消息的codeId,查询对应的昨日消息数量
      const {messageList} = this.props.mobile
      let messageKeyList = new Array();
      let codeNameTemMap = {};
      messageList ?
        messageList.forEach(e => {
          codeNameTemMap[e.key] = e.latestMessage.sourceAsMap.codeName
          messageKeyList.push(e.key)
        }) : void (0)
      this.setState({codeNameMap: codeNameTemMap, messageKeyList: messageKeyList})
      messageKeyList.length ? this.queryYesterdayMessageNum(messageKeyList) : void (0)
    })
  }

  queryYesterdayMessageNum(messageKeyList) {
    const {dispatch} = this.props
    dispatch({
      type: 'yesterday/queryYesterdayMessageNum', payload: {key: messageKeyList},
      callback: () => {
      }
    }).then(() => {
      //把id相同的name和查出来的num，相匹配，组成新的map
      const {num} = this.props.yesterday
      const {codeNameMap, messageKeyList} = this.state
      codeNameMap ? this.getNameNumMap(num, codeNameMap, messageKeyList) : void(0)
    })
  }

  getNameNumMap(num, codeNameMap, messageKeyList) {
    const {dispatch} = this.props
    let nameNumMap = {};
    messageKeyList.forEach(e => {
      "undefined" !== typeof (codeNameMap[e]) ?
        nameNumMap[codeNameMap[e]] = num[e] :
        nameNumMap[e] = num[e]
    })
    nameNumMap ? dispatch({type: 'yesterday/setState', payload: {nameNumMap: nameNumMap}}) : void(0)
  }

  render() {
    const url = (window.location.href).split("yesterday")[0]
    const {yesterdayDetail, nameNumMap} = this.props.yesterday
    let nameNumArr = nameNumMap !== null ? JSON.stringify(nameNumMap).toString().replace("{", "").replace("}", "").split(',') : null

    return (
      <div className={styles.body}>
        {yesterdayDetail == null || nameNumArr == null ?
          <div className={styles.mySpin}><ActivityIndicator toast text="请稍等"/></div> :
          yesterdayDetail != "" && nameNumArr !== null ?
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
              {
                yesterdayDetail[1] && yesterdayDetail[1].length ?
                  <div className={styles.field}>
                    <div className={styles.titleField}>
                      <div className={styles.title}>
                        <div className={styles.imgField}><img src="../application/mobile/node/node.png"/></div>
                        <div>节点</div>
                      </div>
                    </div>
                    <div className={styles.contentField}>
                      <div className={styles.content}>
                        {
                          yesterdayDetail[1].map(item => {
                            return (
                              item ?
                                <div className={styles.rowContent}>{item.substring(2, item.length)}</div> : void(0)
                            )
                          })
                        }
                      </div>
                    </div>
                  </div> : void(0)
              }
              {
                yesterdayDetail[2] && yesterdayDetail[2].length ?
                  <div className={styles.field}>
                    <div className={styles.titleField}>
                      <div className={styles.title}>
                        <div className={styles.imgField}><img src="../application/mobile/node/ElasticSearch.png"/></div>
                        <div>ES</div>
                      </div>
                    </div>
                    <div className={styles.contentField}>
                      <div className={styles.content}>
                        {
                          yesterdayDetail[2].map(item => {
                            return (
                              item ?
                                <div className={styles.rowContent}>
                                  <div>{item.substring(3, item.indexOf(":"))}</div>
                                  <div>{item.substring(item.indexOf(":") + 1, item.length)}</div>
                                </div> : void(0)
                            )
                          })
                        }
                      </div>
                    </div>
                  </div> : void(0)
              }
              {
                yesterdayDetail[3] && yesterdayDetail[3].length ?
                  <div className={styles.field}>
                    <div className={styles.titleField}>
                      <div className={styles.title}>
                        <div className={styles.imgField}><img src="../application/mobile/node/tablespace.png"/></div>
                        <div>表空间</div>
                      </div>
                    </div>
                    <div className={styles.contentField}>
                      <div className={styles.content}>
                        {
                          yesterdayDetail[3].map(item => {
                            return (
                              item ?
                                <div className={styles.rowContent}>
                                  <div>{item.substring(3, item.indexOf(":"))}</div>
                                  <div>{item.substring(item.indexOf(":") + 1, item.length)}</div>
                                </div> : void(0)
                            )
                          })
                        }
                      </div>
                    </div>
                  </div> : void(0)
              }
              {
                (yesterdayDetail[0] && yesterdayDetail[0].length) && nameNumArr.length ?
                  <div className={styles.field}>
                    <div className={styles.titleField}>
                      <div className={styles.title}>
                        <div className={styles.imgField}><Icon style={{color: "#3685e1"}} type="bar-chart"/></div>
                        <div>统计</div>
                      </div>
                    </div>
                    <div className={styles.contentField}>
                      <div className={styles.content}>
                        <div className={styles.rowContent}>
                          <div>{yesterdayDetail[0].substring(0, yesterdayDetail[0].indexOf("："))}</div>
                          <div>{yesterdayDetail[0].substring(yesterdayDetail[0].indexOf("：") + 1, yesterdayDetail[0].length)}</div>
                        </div>
                        {
                          nameNumArr ? nameNumArr.map(e => {
                            let text = e.substring(e.indexOf("\"") + 1, e.indexOf("\":"));
                            let num = e.substring(e.indexOf(":\"") + 2, e.length - 1)
                            {
                              return (
                                e && "0" !== num ?
                                  <div className={styles.rowContent}>
                                    <div>{text}</div>
                                    <div>{num + "条"}</div>
                                  </div> : void(0)
                              )
                            }
                          }) : void (0)
                        }
                      </div>
                    </div>
                  </div>
                  : void(0)
              }
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

export default connect(({yesterday, mobile}) => ({yesterday, mobile}))(Index)

