/*
* create by dhl  2018.5.31
* */

import React, {Component} from 'react'
import {connect} from 'dva'
import style from './index.less'
import {Icon} from 'antd'

export default class Info extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }

  clickIcon() {
  }

  render() {
    return (
      <div className={style.head}>
        <div className={style.first}>
          <img src="./application/mobile/my-banner-01.png" className={style.img}/>
          <div className={style.avatar}>
            <div className={style.again}>
              <div className={style.circle}>
                <img src="./framework/img/smallIcon.png" className={style.img2}/>
              </div>
              <span className={style.name}>天枢</span>
            </div>
          </div>
        </div>
        <div className={style.middle}>
        <span className={style.left}>
          <img src="./application/mobile/ID_03.png" className={style.picture}/>
          <span className={style.text}>ID</span></span>
          <span className={style.right}>123456789</span>
        </div>
        <div className={style.middle}>
          <span className={style.left}>
            <img src="./application/mobile/about_us.png" className={style.picture}/>
            <span className={style.text}>详细信息</span></span>
          <Icon type="right" className={style.right} onClick={() => this.clickIcon()}/>
        </div>

      </div>
    )
  }
}
