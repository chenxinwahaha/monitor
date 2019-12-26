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
    if (item.title == '状态' && item.content == "异常" || item.content == '加载失败') {
      return "#ff5f5f"
    } else if (item.title == '状态' && item.content == "正常") {
      return "#90d270"
    } else {
      return "#000000"
    }
  }

  clickRow(item) {
    const {visible} = this.state
    if (item.title === '状态' && item.title == '错误详情' || item.content == '加载失败') {
      this.setState({visible: !visible})
    } else if (item.title == '状态' && item.content == '错误详情') {
      this.setState({visible: !visible})
    } else if (item.title == '错误详情' && item.content == '') {
      this.setState({visible: !visible})
    }

  }

  rightContent() {
    <Icon type="up"/>
  }

  render() {
    const {modalVisible, content, title} = this.props
    const {visible} = this.state
    let error = content && content.length !== 0 ? content[content.length - 1] : void(0)
    let errorContent = ''
    if (error && error.title === 'error') {
      errorContent = error.content
    }
    return (
      <Modal
        visible={modalVisible}
        footer={null}
        closable={null}
        width='60rem'
        onCancel={() => {
          this.setState({visible: true})
          this.props.closeModal()
        }}
        wrapClassName={style.class}
        onVisibleChange={() => {
        }}
      >
        <div className={style.total}>
          <div className={style.title}>{title}</div>
          <div className={style.datas}>
            {content && content.length > 0 ? content.map((item, index) => {
              if (item.title !== 'error') {
                return item.title == "错误提示" || item.title == "错误类型" || item.title == "错误消息" ? (
                  item.content !== "" ?
                    (
                      <div className={style.data} key={index} id={item.title} onClick={() => {
                        this.clickRow(item)
                      }}>
                        <div className={style.errorContent}>
                          <span className={style.left}>{item.title}</span>
                          <span className={style.right} style={{color: this.fontColor(item)}}>{item.title == '错误详情' ?
                            <Icon type={visible ? 'up' : 'down'}/> :
                            (item.title == "节点" ? (item.content ? item.content : "sieMonitor") : item.content)}</span>
                        </div>
                      </div>
                    ) : void (0)) : (
                  <div className={style.data} key={index} id={item.title} onClick={() => {
                    this.clickRow(item)
                  }}>
                    <div className={style.content}>
                      <span className={style.left}>{item.title}</span>
                      <span className={style.right} style={{color: this.fontColor(item)}}>{item.title == '错误详情' ?
                        <Icon type={visible ? 'up' : 'down'}/> :
                        (item.title == "节点" ? (item.content ? item.content : "sieMonitor") : item.content)}</span>
                    </div>
                  </div>
                )
              }
            }) : void(0)}
          </div>
          <div className={style.error}
               id='error' style={{
            height: errorContent.length > 500 ? 0.8 * height - 500 : 0.5 * height - 400,
            display: visible ? '' : 'none'
          }}>
            <pre>{errorContent}</pre>
          </div>

        </div>
      </Modal>

    )
  }
}

export default connect((appModel) => (appModel))(Index)
