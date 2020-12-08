/**
 * Created by 陈鑫 on 2018/5/30.
 */
import React, {Component} from 'react'
import styles from './index.less'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 'iot'
    }
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch(routerRedux.push({
      pathname: 'iot',
      query: {},
    }));
  }

  clickBotton(value) {
    const {dispatch} = this.props
    this.setState({
      selected: value
    })
    dispatch(routerRedux.push({
      pathname: value,
      query: {},
    }));
  }

  render() {
    const {selected} = this.state
    return (
      <div className={styles.body}>
        <div className={styles.main}>
          {this.props.children}
        </div>
        <div className={styles.bottom}>
          <div className={styles.botton} onClick={() => this.clickBotton('iot')}>
            <img
              className={styles.img}
              src={selected == 'iot' ? "application/mobile/botton/homePage_selected.svg" : "application/mobile/botton/homePage.svg"}/>
            <div className={selected == 'iot' ? styles.textSelected : styles.text}>首页</div>
          </div>
          <div className={styles.botton} onClick={() => this.clickBotton('app')}>
            <img
              className={styles.img}
              src={selected == 'app' ? "application/mobile/botton/app_selected.png" : "application/mobile/botton/app.png"}/>
            <div className={selected == 'app' ? styles.textSelected : styles.text}>设备</div>
          </div>
          {/*<div className={styles.botton} >*/}
          {/*  <img*/}
          {/*    className={styles.img}*/}
          {/*    src={selected == 'message' ? "application/mobile/botton/new_selected.png" : "application/mobile/botton/new.png"}/>*/}
          {/*  <div className={selected == 'message' ? styles.textSelected : styles.text}>消息</div>*/}
          {/*</div>*/}
          {/*/!*<div className={styles.botton} onClick={() => this.clickBotton('node')}>*!/*/}
          {/*/!*  <img*!/*/}
          {/*/!*    className={styles.img}*!/*/}
          {/*/!*    src={selected == 'node' ? "application/mobile/botton/node_selected.png" : "application/mobile/botton/node.png"}/>*!/*/}
          {/*/!*  <div className={selected == 'node' ? styles.textSelected : styles.text}>节点</div>*!/*/}
          {/*/!*</div>*!/*/}

          {/*<div className={styles.botton} onClick={() => this.clickBotton('info')}>*/}
          {/*  <img*/}
          {/*    className={styles.img}*/}
          {/*    src={selected == 'info' ? "application/mobile/botton/my_selected.png" : "application/mobile/botton/my.png"}/>*/}
          {/*  <div className={selected == 'info' ? styles.textSelected : styles.text}>我的</div>*/}
          {/*</div>*/}
        </div>
      </div>
    )
  }
}

export default connect((mobile) => (mobile))(Index)
