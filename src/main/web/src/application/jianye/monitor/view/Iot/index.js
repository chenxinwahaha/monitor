/*
* create by dhl  2018.5.31
* */

import React, {Component} from 'react'
import {connect} from 'dva'
import TransactionFoldLineDiagram from '../homePage/transactionFoldLineDiagram/index'
import styles from './index.less'
import {routerRedux} from 'dva/router'
import Radar from '../../component/Radar/radar'
import {Tabs, Button, Menu, Dropdown, Icon, Spin} from 'antd';
import {List, Toast, ActivityIndicator, Popover} from 'antd-mobile';
import NodeCard from "../node/nodeCard";

const Item = Popover.Item;
const TabPane = Tabs.TabPane;

class Iot extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectBar: 'if',
      selectDate: '今日',
      visible: false,
      selected: '',
    }
  }

  componentDidMount() {
    const {dispatch} = this.props
    const {selectDate} = this.state
    const {homepageSelectDate} = this.props.mobile
    // dispatch({type: 'mobile/monitorNode'});
    dispatch({
      type: 'mobile/setState', payload: {selectRadio: "if"}
    });
    if ("今日" == homepageSelectDate) {
      dispatch({type: 'mobile/queryTransactionByDate', payload: {"type": 1}})
    } else if ("昨日" == homepageSelectDate) {
      dispatch({type: 'mobile/queryTransactionByDate', payload: {"type": 2}})
    } else if ("本周" == homepageSelectDate) {
      dispatch({type: 'mobile/queryTransactionByDate', payload: {"type": 3}})
    } else if ("本月" == homepageSelectDate) {
      dispatch({type: 'mobile/queryTransactionByDate', payload: {"type": 4}})
    }
  }

  handleVisibleChange = (visible) => {
    this.setState({
      visible,
    });
  };

  onSelect = (opt) => {
    this.setState({
      visible: false,
      selected: opt.props.value,
      selectDate: opt.props.value
    });
    const {dispatch} = this.props
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
    } else if ("本月" == opt.props.value) {
      dispatch({type: 'mobile/queryTransactionByDate', payload: {"type": 4}})
    }
  };

  renderNode(list) {
    return list.map(value => {
      if (value && value.organizer) {
        return (
          <div className={styles.transaction} style={{borderTop: "1px solid #eeeeee"}}>
            <div className={styles.transactionContent}>
              <div className={styles.total}>
                <div className={styles.totalTransaction}>{value.organizer}<span
                  className={styles.totalSpan}></span>
                </div>
              </div>

              <div className={styles.unNormal}>
                <div className={styles.transactionDiv} style={{color: 'blue'}}>{value.num}<span
                  className={styles.errorSpan}></span>
                </div>
              </div>
              <div className={styles.unNormal}>
                <div className={styles.transactionDiv} style={{color: 'green'}}>{value.mini}<span
                  className={styles.errorSpan}></span>
                </div>
              </div>

              <div className={styles.unNormal}>
                <div className={styles.transactionDiv} style={{color: 'cornflowerblue'}}>{value.iot}<span
                  className={styles.errorSpan}></span>
                </div>
              </div>

              <div className={styles.unNormal}>
                <div className={styles.transactionDiv} style={{color: 'grey'}}>{value.wg}<span
                  className={styles.errorSpan}></span>
                </div>
              </div>
            </div>
          </div>
        )
      }
    })

  }

  render() {
    const {selectBar, selectDate} = this.state
    const {
      selectHour, totalTransaction, successTransaction, errorTransaction, homepageSelectDate,
      monitorList, todayTransactionInfo, yesterdayTransactionInfo, thisWeekTransactionInfo
    } = this.props.mobile;

    return (
      <div className={styles.body}>
        {monitorList ? <div className={styles.total}>
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
                             (<Item key="7" value="本月" style={{
                               fontSize: '3rem', height: '8rem',
                               display: 'flex',
                               alignItems: 'center',
                               borderBottom: '1px solid #d9d9d9',
                               justifyContent: 'center'
                             }}>本月</Item>),
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
            <div className={styles.transaction}>
              <div className={styles.transactionContent}>
                <div className={styles.total}>
                  <div className={styles.totalTransaction}>主办单位<span
                    className={styles.totalSpan}></span>
                  </div>
                </div>
                <div className={styles.unNormal}>
                  <div className={styles.transactionDiv}>总计<span
                    className={styles.errorSpan}></span>
                  </div>
                </div>

                <div className={styles.unNormal}>
                  <div className={styles.transactionDiv}>小程序<span
                    className={styles.errorSpan}></span>
                  </div>
                </div>
                <div className={styles.unNormal}>
                  <div className={styles.transactionDiv}>刷脸设备<span
                    className={styles.errorSpan}></span>
                  </div>
                </div>
                <div className={styles.unNormal}>
                  <div className={styles.transactionDiv}>微光盒子<span
                    className={styles.errorSpan}></span>
                  </div>
                </div>
              </div>
            </div>
            {monitorList && monitorList.length ? this.renderNode(monitorList) : ''}
          </div>
        </div> : <div className={styles.mySpin}><ActivityIndicator toast text="请稍等"/></div>}
      </div>
    )
  }
}


export default connect(({mobile, appModel}) => ({mobile, appModel}))(Iot)
