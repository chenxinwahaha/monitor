/**
 * Created by 陈鑫 on 2018/5/31.
 * dhl 2018  on 6/1
 */
import React, {Component} from 'react'
import {List, Toast, ActivityIndicator, Popover} from 'antd-mobile';
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import style from './index.less'
import styles from "../Iot/index.less";
import {Tabs} from "antd";

const Item = Popover.Item;
const TabPane = Tabs.TabPane;

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch({type: 'mobile/selectIotBoxListByOrg'});
  }

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
            </div>
          </div>
        )
      }
    })
  }

  renderCount(list) {
    let count = 0
    list.map(value => {
      if (value && value.num) {
        count = count + parseInt(value.num)
      }
    })
    return count
  }

  render() {
    const {boxList} = this.props.mobile
    return (
      <div className={styles.body}>
        {boxList ? <div className={styles.total}>
          <div className={styles.tabChange}>
            {/*今日 昨日 本周*/}
            <div className={styles.dateChooseBar}>
              <div className={styles.bar}>
                <div className={styles.dataDetail}>设备部署详情</div>
                <div>共{boxList.length ? this.renderCount(boxList) : 0}台</div>
              </div>
            </div>
            <div className={styles.transaction}>
              <div className={styles.transactionContent}>
                <div className={styles.total}>
                  <div className={styles.totalTransaction}>账号<span
                    className={styles.totalSpan}></span>
                  </div>
                </div>
                <div className={styles.unNormal}>
                  <div className={styles.transactionDiv}>设备数量<span
                    className={styles.errorSpan}></span>
                  </div>
                </div>
              </div>
            </div>
            {boxList && boxList.length ? this.renderNode(boxList) : ''}
          </div>
        </div> : <div className={styles.mySpin}><ActivityIndicator toast text="请稍等"/></div>}
      </div>
    )
  }
}

export default connect((mobile) => (mobile))(Index)
