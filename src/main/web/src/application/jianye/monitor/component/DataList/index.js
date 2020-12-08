/*
 * Created by dhl 2018  on 6/1
 */
import React, {Component} from 'react'
import {Modal, List, Button, WhiteSpace, WingBlank} from 'antd-mobile';


import styles from './index.less'

const Item = List.Item;
const Brief = Item.Brief;


export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible:false
    };
  }


  render() {
    const {name,status,current,time,pictureUrl,color}=this.props
    const {modalVisible}=this.state
    return (
      <div className={styles.total}>
        <div className={styles.content}>
          <div className={styles.picture}><img src={pictureUrl}/>
          </div>
          <div className={styles.rightContent}>
            <div className={styles.top}>
              <div className={styles.name}> {name}</div>
              <div className={styles.status} style={{color: status=="阻塞总数" ? '': status=='异常' || status == '加载失败'?'#ff5f5f':'#90d270'}}>{status}</div>
            </div>
            <div className={styles.bottom}>
              <div className={styles.current}>{current}</div>
              <div className={styles.time} style={{color: color ? color :''}}>{time}</div>
            </div>

          </div>
        </div>

      </div>
    )
  }
}
