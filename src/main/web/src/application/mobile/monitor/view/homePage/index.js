/**
 * FileName: index
 * Author:   wxxx
 * Date:     2018/10/16 10:04 AM
 */
import React, {Component} from 'react'
import {connect} from 'dva'
import TransactionFoldLineDiagram from './transactionFoldLineDiagram/index'
import styles from './index.less'
import {routerRedux} from 'dva/router'
import Radar from '../../component/Radar/radar'
import {Tabs, Button, Menu, Dropdown, Icon, Spin} from 'antd';
import {List, Toast, ActivityIndicator, Popover} from 'antd-mobile';

const Item = Popover.Item;
const TabPane = Tabs.TabPane;

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectBar: 'if',
      selectDate: '今日',
      visible: false,
      selected: '',
    }
  }

  componentWillMount() {
    const {dispatch} = this.props
    const {selectDate} = this.state

    const {homepageSelectDate} = this.props.mobile

    dispatch({type: 'mobile/queryTransaction', payload: {date: homepageSelectDate}});
    dispatch({type: 'mobile/monitorNode'});
    dispatch({
      type: 'mobile/setState', payload: {selectRadio: "if"}
    });

    if ("今日" == homepageSelectDate) {
      dispatch({type: 'mobile/queryTransactionByDate', payload: {"type": 1}})
    } else if ("昨日" == homepageSelectDate) {
      dispatch({type: 'mobile/queryTransactionByDate', payload: {"type": 2}})
    } else if ("本周" == homepageSelectDate) {
      dispatch({type: 'mobile/queryTransactionByDate', payload: {"type": 3}})
    }

  }


  clickBotton(value) {
    const {dispatch} = this.props
    const {homepageSelectDate, selectHour, inHome} = this.props.mobile
    if (selectHour && inHome) {
      dispatch(routerRedux.push({
        pathname: value,
        query: {},
      }));
      dispatch({
        type: 'mobile/queryFlowName'
      }).then(
        dispatch({
          type: 'mobile/queryAppName'
        })
      ).then(
        dispatch({
            type: 'mobile/queryTransactionByScroll',
            payload: {type: "flowId", dateCode: homepageSelectDate, time: selectHour},
            callback: () => {
            }
          }
        ))
    }
  }

  getTransactionCount(count) {
    if (count >= 100000000) {
      let value = count / 100000000
      let temp = Number(value);
      temp = Math.floor(temp * 1000) / 1000;
      temp = temp.toFixed(3);
      return temp.toString() + "亿"
    } else if (count >= 10000000 && count < 100000000) {
      let value = count / 10000000;
      let temp = Number(value);
      temp = Math.floor(temp * 1000) / 1000;
      temp = temp.toFixed(3);
      return temp.toString() + "千万"
    } else {
      return count.toLocaleString()
    }
  }

  onSelect = (opt) => {
    this.setState({
      visible: false,
      selected: opt.props.value,
      selectDate: opt.props.value
    });
    const {dispatch} = this.props
    dispatch({type: 'mobile/queryTransaction', payload: {date: opt.props.value}});
    dispatch({
      type: 'mobile/setState',
      payload: {homepageSelectDate: opt.props.value}
    })
    if ("今日" == opt.props.value) {
      dispatch({type: 'mobile/queryTransactionByDate', payload: {"type": 1}})
    } else if ("昨日" == opt.props.value) {
      dispatch({type: 'mobile/queryTransactionByDate', payload: {"type": 2}})
    } else if ("本周" == opt.props.value) {
      dispatch({type: 'mobile/queryTransactionByDate', payload: {"type": 3}})
    }
  };

  handleVisibleChange = (visible) => {
    this.setState({
      visible,
    });
  };

  render() {
    const {selectBar, selectDate} = this.state
    const {
      selectHour, totalTransaction, successTransaction, errorTransaction, homepageSelectDate,
      monitorList, todayTransactionInfo, yesterdayTransactionInfo, thisWeekTransactionInfo
    } = this.props.mobile;

    return (
      <div className={styles.body}>
        {monitorList ? <div className={styles.total}>
          <div className={styles.top}>
            <Radar monitorList={monitorList}/>
          </div>
          <div className={styles.tabChange}>
            {/*今日 昨日 本周*/}
            <div className={styles.dateChooseBar}>
              <div className={styles.bar}>
                <div className={styles.dataDetail}>数据详情</div>
                <div className={styles.dateChoose}>
                  <Popover mask
                           overlayClassName="fortest"
                           overlayStyle={{color: 'currentColor', width: '20rem'}}
                           visible={this.state.visible}
                           placement='bottomRight'
                           overlay={[
                             (<Item key="4" value="今日" style={{
                               fontSize: '3rem', height: '8rem',
                               display: 'flex',
                               alignItems: 'center',
                               borderBottom: '1px solid #d9d9d9',
                               justifyContent: 'center'
                             }}>今日</Item>),
                             (<Item key="5" value="昨日" style={{
                               fontSize: '3rem', height: '8rem',
                               display: 'flex',
                               alignItems: 'center',
                               borderBottom: '1px solid #d9d9d9',
                               justifyContent: 'center'
                             }}>昨日</Item>),
                             (<Item key="6" value="本周" style={{
                               fontSize: '3rem', height: '8rem',
                               display: 'flex',
                               alignItems: 'center',
                               borderBottom: '1px solid #d9d9d9',
                               justifyContent: 'center'
                             }}>本周</Item>),
                           ]}
                           align={{
                             overflow: {adjustY: 0, adjustX: 0},
                             offset: [-10, 0],
                           }}
                           onVisibleChange={this.handleVisibleChange}
                           onSelect={this.onSelect}
                  >
                    <div className={styles.dateChooseButton}>
                      <span style={{color: '#0085e8', fontWeight: 'bold'}}>{homepageSelectDate}</span>
                      {/*<Icon type="ellipsis" style={{color: 'rgb(0, 133, 232)'}}/>*/}
                    </div>
                  </Popover>
                </div>
              </div>
            </div>
            {/*交易量*/}
            <div className={styles.transaction}>
              <div className={styles.transactionContent}>
                <div className={styles.total}>
                  <div className={styles.totalTransaction}>总交易量<span
                    className={styles.totalSpan}>{this.getTransactionCount(totalTransaction)}</span>
                  </div>
                </div>
                <div className={styles.normal}>
                  <div className={styles.transactionDiv}>正常<span
                    className={styles.normalSpan}>{this.getTransactionCount(successTransaction)}</span>
                  </div>
                </div>
                <div className={styles.unNormal}>
                  <div className={styles.transactionDiv}>异常<span
                    className={styles.errorSpan}>{this.getTransactionCount(errorTransaction)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div onClick={() => this.clickBotton("transactionDetail")}>
              <TransactionFoldLineDiagram selectBar={selectBar}
                                          selectDate={homepageSelectDate}
                                          todayTransactionInfo={todayTransactionInfo}
                                          yesterdayTransactionInfo={yesterdayTransactionInfo}
                                          thisWeekTransactionInfo={thisWeekTransactionInfo}/>
            </div>
          </div>
        </div> : <div className={styles.mySpin}><ActivityIndicator toast text="请稍等"/></div>}
      </div>
    )
  }
}

export default connect(({mobile, appModel}) => ({mobile, appModel}))(Index)
