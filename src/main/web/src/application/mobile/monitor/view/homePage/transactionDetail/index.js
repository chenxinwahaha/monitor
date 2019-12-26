/**
 * FileName: index
 * Author:   wxxx
 * Date:     2018/10/17 5:09 PM
 */
import React, {Component} from 'react'
import {connect} from 'dva'
import styles from './index.less'
import {routerRedux} from 'dva/router'
import {Tabs, Radio, Divider, Button, Menu, Dropdown, Icon, List, Progress} from 'antd';
import {Scrollbars} from 'react-custom-scrollbars';
import {ActivityIndicator} from 'antd-mobile';

const count = Math.ceil(document.body.clientHeight * 0.92684 * 0.88 / (document.body.clientHeight * 0.0665))


class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectType: '',
      pageNo: 1,
      dataList: [],
      timeStatus: '0'
    }
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

  handleModeChange = (e) => {
    const {dispatch} = this.props
    const selectRadio = e.target.value;
    dispatch({
      type: 'mobile/setState', payload: {selectRadio: selectRadio}
    })
  }

  onScrollHandle(top, formatData, data) {
    const {dataList, pageNo} = this.state
    let pageCount = Math.ceil(data.length / count)
    if (data && data.length && pageCount !== pageNo) {
      if (top > 0.995 && pageCount !== pageNo) {
        this.setState({pageNo: pageNo + 1})
        let d = data.slice(count * pageNo, count * (pageNo + 1))
        for (let y = 0; y < d.length; y++) {
          if (-1 == formatData.indexOf(d[y])) {
            formatData.push(d[y])
          }
        }
      }
      this.setState({dataList: formatData})
    }
  }


  clickBotton(value) {
    const {dispatch} = this.props
    dispatch(routerRedux.push({
      pathname: value,
      query: {},
    }));
  }

  queryFirstPage(t, radioType) {
    const {dispatch} = this.props
    const {homepageSelectDate, selectHour} = this.props.mobile
    dispatch({
      type: 'mobile/queryTransactionByScroll',
      payload: {type: t, dateCode: homepageSelectDate, time: selectHour},
      callback: () => this.setState({timeStatus: '1'})
    }).then(() => {
      dispatch({
        type: 'mobile/setState', payload: {selectRadio: radioType}
      })
      this.setState({dataList: [], pageNo: 1})
    })
  }

  getFlowName(flowId) {
    const {flowNameList} = this.props.mobile
    const filtered = flowNameList.filter(item => {
      return (item.id == flowId)
    })
    return (null != filtered[0]) ? filtered[0].name : ""
  }

  getAppName(appId) {
    const {appNameList} = this.props.mobile
    const filtered = appNameList.filter(item => {
      return (item.id == appId)
    })
    return (null != filtered[0]) ? filtered[0].name : ""
  }

  setFoldLineTypeInfo(selectRadio, flowId) {
    const {dispatch, mobile} = this.props
    const {flowNameList, appNameList} = mobile
    "if" == selectRadio ?
      dispatch({
        type: 'mobile/setState',
        payload: {selectFlow: flowId, selectType: "if", name: flowNameList.filter(item => item.id == flowId)[0]}
      }) : dispatch({
        type: 'mobile/setState',
        payload: {selectApp: flowId, selectType: "app", name: appNameList.filter(item => item.id == flowId)[0]}
      })
  }

//获取nodeId,success\error数量
  getTransactionDeatil(dataPayload) {
    var result = []
    let success = dataPayload.filter(item => item.key == "SUCCESS").length ? dataPayload.filter(item => item.key == "SUCCESS")[0] : null
    success ? success.field.buckets.forEach(a => {
      result.push(a)
    }) : void 0
    let error = dataPayload.filter(item => item.key == "ERROR").length ? dataPayload.filter(item => item.key == "ERROR")[0] : null
    error ? error.field.buckets.forEach(b => {
      if (result.filter(item => item.key == b.key).length) {
        let map = result.filter(item => item.key == b.key)[0];
        map.doc_error_count = b.doc_count;
      }
      else {
        result.push({key: b.key, doc_error_count: b.doc_count})
      }
    }) : void 0
    return result
  }

  getTransactionCount(count) {
    if (count >= 100000000 && count < 10000000000) {
      let value = count / 100000000
      let temp = this.formatNum(value)
      return temp.toLocaleString() + "亿"
    } else if (count >= 10000000000) {
      let value = count / 10000000000
      let temp = this.formatNum(value)
      return temp.toLocaleString() + "百亿"
    } else if (count >= 10000 && count < 1000000) {
      let value = count / 10000
      let temp = this.formatNum(value)
      return temp.toLocaleString() + "万"
    } else if (count >= 1000000 && count < 10000000) {
      let value = count / 1000000
      let temp = this.formatNum(value)
      return temp.toLocaleString() + "百万"
    } else if (count >= 10000000 && count < 100000000) {
      let value = count / 10000000
      let temp = this.formatNum(value)
      return temp.toLocaleString() + "千万"
    } else {
      return count ? count.toLocaleString() : 0
    }
  }

  formatNum(value) {
    let temp = Number(value);
    temp = Math.floor(temp * 1000) / 1000;
    temp = temp.toFixed(1);
    return temp
  }

  spliceData(data) {
    if (data && data.length) {
      if (data.length > count) {
        return data.slice(0, count)
      } else {
        return data
      }
    }
  }

  componentWillUnmount() {
    const {dispatch} = this.props
    dispatch({
      type: "mobile/setState",
      payload: {inHome: null}
    })
  }

  componentDidMount() {
    this.setState({timeStatus: '1'})
  }

  render() {
    const {dataList, timeStatus} = this.state
    const {esList, selectRadio} = this.props.mobile
    const data = esList ? esList.length ? this.getTransactionDeatil(esList) : [] : null;
    const formatData = this.spliceData(data);
    return (
      <div className={styles.back}>
        <div className={styles.total}>
          <div className={styles.radio}>
            <Radio.Group value={selectRadio} className={styles.radioGroup}>
              <Radio.Button className={styles.radioButtonLeftStyle} value="if"
                            onClick={() => {
                              this.queryFirstPage("flowId", "if")
                            }}><span className={styles.radioText}>集成流</span></Radio.Button>
              <Radio.Button className={styles.radioButtonRightStyle} value="app"
                            onClick={() => {
                              this.queryFirstPage("app", "app")
                            }}><span className={styles.radioText}>应用</span></Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <Divider style={{marginBottom: '0rem'}}/>
        <div className={styles.listContent} id={"content"}>

          <Scrollbars
            onScroll={() => {
            }}
            onScrollFrame={(e) => {
              this.onScrollHandle(e.top, formatData.slice(), data.slice())
            }}>
            {
              data && data.length && "0" !== timeStatus ?
                <List
                  itemLayout="horizontal"
                  //dataSource={dataList.length ? dataList : formatData}
                  dataSource={dataList.length ? dataList : formatData}
                  className={styles.listItem}
                  renderItem={item => (
                    <div style={{
                      height: '10rem',
                      borderBottom: '1px solid #efefef',
                      display: 'flex',
                      alignItems: 'center'
                    }} onClick={() => {
                      this.clickBotton("transactionDetailFoldLine"),
                        this.setFoldLineTypeInfo(selectRadio, item.key)
                    }}
                    >
                      <div className={styles.listRowContent}>
                        <div className={styles.left}>
                          <div className={styles.listRowImg}>
                            {
                              "if" == selectRadio ?
                                <img style={{width: '5rem', height: '5rem'}} src="./application/mobile/if.svg"/> :
                                <img style={{width: '5rem', height: '5rem'}} src="./application/mobile/app.svg"/>
                            }
                          </div>
                          <div className={styles.listRowInfo}>
                            <div className={styles.flowNameText}>
                              {"if" == selectRadio ? this.getFlowName(item.key) : this.getAppName(item.key)}
                            </div>
                            <div className={styles.flowIdText}>{item.key}</div>
                          </div>
                        </div>

                        <div className={styles.listRowTransaction}>
                          <div className={styles.listRowTransactionCountSuccess}>
                            <div><span style={{fontSize: "2.5rem"}}>正常</span><span
                              className={styles.normal}>{this.getTransactionCount(item.doc_count ? item.doc_count : 0)}</span>
                            </div>
                          </div>
                          <div className={styles.listRowTransactionCountError}>
                            <div><span style={{fontSize: "2.5rem"}}>异常</span><span
                              className={styles.error}>{this.getTransactionCount(item.doc_error_count ? item.doc_error_count : 0)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                />
                : this.setTime()
            }
          </Scrollbars>
        </div>
      </div>
    )
  }
}

export default connect(({mobile, appModel}) => ({mobile, appModel}))(Index)
