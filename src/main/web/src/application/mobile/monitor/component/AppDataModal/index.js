/*
 * Created by dhl 2018  on 6/1
 */
import React, {Component} from 'react'
import {List, Button, WhiteSpace, WingBlank} from 'antd-mobile';
import {Modal, Icon} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import style from './index.less'

const Item = List.Item;
const Brief = Item.Brief;

const height = document.body.clientHeight

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true
    };
  }


  fontColor(item) {
    if (item.title == '状态' && item.content == "异常") {
      return "#ff5f5f"
    } else if (item.title == '状态' && item.content == "正常") {
      return "#90d270"
    } else {
      return "#000000"
    }
  }

  clickRow(item) {
    const {visible} = this.state
    if (item.type === '1') {
      this.setState({visible: !visible})
    }
  }

  errorData(errorContent) {
    if (errorContent && errorContent.length > 0) {
      return errorContent.map(item => {
          return <div style={{justifyContent: "space-between", display: "flex", alignItems: "center", height: "6.6rem"}}>
            <span className={style.left}>{item.title}</span>
            <span className={style.right}>{item.content}</span>
          </div>
        }
      )
    }
  }

  render() {
    const {modalVisible, content, load} = this.props
    const {visible} = this.state
    let error = content && content.length !== 0 ? content[content.length - 1] : void(0)
    const errorContent = []
    return (
      <Modal
        visible={modalVisible}
        footer={null}
        closable={null}
        width='60rem'
        onCancel={() => {
          this.props.closeModal();
          this.setState({visible: true})
        }}
        wrapClassName={style.class}
        onVisibleChange={() => {
        }}
      >
        <div className={style.total}>
          <div className={style.title}>数据详情</div>
          <div className={style.datas}>
            {content && content.length > 0 ? content.map((item, index) => {
              if (item.type == "0" || item.type == "1") {
                return (
                  <div className={style.data} key={index} id={item.title} onClick={() => {
                    this.clickRow(item)
                  }}>
                    <div className={style.content}>
                      <span className={style.left}>{item.title}</span>
                      <span className={style.right}
                            style={{color: this.fontColor(item)}}>{item.title == '阻塞的集成流' || item.title == '阻塞的应用名' ?
                        <Icon type={visible ? 'up' : 'down'}/> : item.content}</span>
                    </div>
                  </div>
                )
              }
              else if (item.type == "2") {
                errorContent.push(item)
              }
            }) : void(0)}
          </div>
          <div className={style.error} id='error' style={{display: visible ? '' : 'none', height: 0.8 * height - 430}}>
            <div style={{justifyContent: "space-between", display: "flex", height: "6.6rem", alignItems: "center"}}>
              <span className={style.left}>{load == "if" ? "阻塞的集成流" : "阻塞的应用"}</span>
              <span className={style.right}>{load == "if" ? "阻塞的集成流ID" : "阻塞的应用ID"}</span>
            </div>
            {this.errorData(errorContent)}
          </div>

        </div>
      </Modal>

    )
  }
}

export default connect((appModel) => (appModel))(Index)
