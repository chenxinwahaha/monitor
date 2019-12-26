/**
 * Created by 陈鑫 on 2018/4/4.
 */
import React, {Component} from 'react'
import styles from './index.less'
import {connect} from 'dva'
import Node from '../components/node'
import App from '../components/app'
import Volume from './volume/index'
import Message from './message/index'
import NodeAnalysis from './nodeAnalysis/index'
import Tablespace from './tablespace/index'
import {errorName} from '../../framework/common/errorName'

const bodyWidth = document.body.clientWidth
const bodyHeight = document.body.clientHeight
const shortHeight = ((bodyHeight - 20) * 0.91 * 0.39 - 40) * 0.5 * 0.4
const longHeight = ((bodyHeight - 20) * 0.91 * 0.39 - 40) * 0.9 * 0.67
const host = window.location.host

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rectMargin: 0,
      rectHeight: 0,
      animate: 0,
      f: 0,
      appList: null,
      nodeInfos: null,
      tablespaces: null,
      node: null,
      messageSwitch: 0,
      topLeftNum: null,
      tradingCount: 0,
      esHealth: null,
      nodeStatus: null,
      cardOne: null,
      cardTwo: null,
      cardThree: null,
      datePeak: 0
    }
  }

  componentWillMount() {
    let height = (1 - 0.0325 * 2) * 0.275 * 0.82 * bodyHeight - 2//减去2是因为border占2px
    let animate = height / 6
    let rectMargin = 0.006 * bodyHeight
    let rectHeight = (height - 7 * rectMargin) / 6
    this.setState({animate, rectMargin, rectHeight})
  }

  componentDidMount() {
    const {messageSwitch} = this.state
    let elements = []
    let elementContainer = $('#itemContainer')
    let sock = new SockJS(`http://${host}/webSocketEvent`)
    let stompClient = Stomp.over(sock)
    this.stompClient(stompClient, elementContainer, elements, messageSwitch)
    setInterval(() => {
      if (sock.readyState !== 1) {
        sock = new SockJS(`http://${host}/webSocketEvent`)
        stompClient = Stomp.over(sock)
        this.stompClient(stompClient, elementContainer, elements, messageSwitch)
      }
    }, 6000)
  }

  runTask() {
    const {dispatch} = this.props
    dispatch({type: 'monitor/runTask'})
  }

  stompClient(stompClient, elementContainer, elements, messageSwitch) {
    stompClient.connect({}, (frame) => {
      this.runTask()
      stompClient.subscribe('/nodeEvent', (response) => {
        if (messageSwitch == 0) {
          this.setState({
            messageSwitch: 1
          })
        }
        this.showMessage(response.body, elementContainer, elements)
      })
      //应用
      stompClient.subscribe('/apps', (response) => {
        if (response.body) {
          this.showApps(response.body)
        }
      })
      //交易量
      stompClient.subscribe('/tradingCount', (response) => {
        if (response.body && response.body != "") {
          this.setState({
            tradingCount: JSON.parse(response.body),
          })
        }
      })
      //交易量
      stompClient.subscribe('/datePeak', (response) => {
        if (response.body && response.body != "") {
          this.setState({
            datePeak: JSON.parse(response.body)
          })
        }
      })
      //节点内存信息
      stompClient.subscribe('/nodes', (response) => {
        if (response.body) {
          this.showNodeInfo(response.body)
        }
      })
      //节点状态信息
      stompClient.subscribe('/nodeStatus', (response) => {
        if (response.body) {
          this.showNodeStatus(response.body)
        }
      })
      //表空间信息
      stompClient.subscribe('/tablespace', (response) => {
        if (response.body) {
          this.showTablespace(response.body)
        }
      })
      //节点信息
      stompClient.subscribe('/node', (response) => {
        if (response.body) {
          this.showNode(response.body)
        }
      })
      //es健康信息
      stompClient.subscribe('/elasticSearchHealth', (response) => {
        if (response.body) {
          this.setState({
            esHealth: JSON.parse(response.body)
          })
        }
      })
    })
  }

  showNode(data) {
    this.setState({
      node: JSON.parse(data)
    })
  }

  showTablespace(data) {
    this.setState({
      tablespaces: JSON.parse(data)
    })
  }

  showApps(data) {
    let list = JSON.parse(data).filter((item, index) => index < 26)
    let topList, bottomList, topMiddle, topLeft, topRight, bottomMiddle, bottomLeft, bottomRight
    if (list && list.length) {
      let length = list.length
      if (length % 2 != 0) {
        topList = list.filter((item, index) => index < (length + 1) / 2)
        bottomList = list.filter((item, index) => index > (length - 1) / 2)
      }
      else {
        topList = list.filter((item, index) => index < (length) / 2)
        bottomList = list.filter((item, index) => index > (length - 2) / 2)
      }
      if (topList && topList.length) {
        topMiddle = topList[0]
        let list = topList.filter((item, index) => index > 0)
        if (list && list.length) {
          let length = list.length
          if (length % 2 != 0) {
            topLeft = list.filter((item, index) => index < (length + 1) / 2)
            topRight = list.filter((item, index) => index > (length - 1) / 2)
          }
          else {
            topLeft = list.filter((item, index) => index < (length) / 2)
            topRight = list.filter((item, index) => index > (length - 2) / 2)
          }
        }
      }
      if (bottomList && bottomList.length) {
        bottomMiddle = bottomList[0]
        let list = bottomList.filter((item, index) => index > 0)
        if (list && list.length) {
          let length = list.length
          if (length % 2 != 0) {
            bottomLeft = list.filter((item, index) => index < (length + 1) / 2)
            bottomRight = list.filter((item, index) => index > (length - 1) / 2)
          }
          else {
            bottomLeft = list.filter((item, index) => index < (length) / 2)
            bottomRight = list.filter((item, index) => index > (length - 2) / 2)
          }
        }
      }
      this.setState({
        appList: {
          "topMiddle": topMiddle,
          "topLeft": topLeft,
          "topRight": topRight,
          "bottomMiddle": bottomMiddle,
          "bottomLeft": bottomRight,
          "bottomRight": bottomLeft,
        },
      })
    }
  }

  findErrorChnName(errorEngName) {
    let list = errorName.filter(item => item.name == errorEngName)
    return list && list.length ? "[" + list[0].chnName + "]" : ""
  }

  showMessage(message, elementContainer, elements) {
    const {animate, rectMargin, rectHeight, tradingCount} = this.state
    message = JSON.parse(message)
    const time = (message.time).split(" ")[1]
    const flag = message.msgState
    const type = message.msgCode
    const id = message.nodeId
    const appId = message.appId
    const errorEngName = message.code
    console.log("message",message)
    if (id && id != "") {
      this.setState({
        tradingCount: tradingCount + 1
      })
      //节点动画
      if (this.refs[id]) {
        this.refs[id].clickNode()
      }
      //应用动画
      if (appId && $(`#${appId}`)) {
        let parentClass = $(`#${appId}`).parent()
        if (appId && $(`#${appId}`) && parentClass) {
          let point
          if (flag == "true") {
            point = $('<div class="normalPoint"></div>')
          }
          else {
            point = $('<div class="abnormalPoint"></div>')
          }
          let parentClassName = parentClass.attr('className')
          if (parentClass.attr('id')) {
            let parentID = parentClass.attr('id')
            if (type == "push" && parentID.indexOf("top") != -1) {
              $(`#${appId}`).css("transform", "rotate(180deg)")
            }
            if (type == "publish" && parentID.indexOf("bottom") != -1) {
              $(`#${appId}`).css("transform", "rotate(180deg)")
            }
            if (parentClassName.indexOf("body_up") == -1) {
              $(`#${appId}`).append(point)
              point.animate({marginTop: shortHeight}, 500, 'linear', function () {
                $(this).remove()
              })
            }
            else {
              $(`#${appId}`).append(point)
              point.animate({marginTop: longHeight}, 1000, 'linear', function () {
                $(this).remove()
              })
            }
          }
        }
      }
      //消息
      if (flag == 'false') {
        elementContainer.children().remove()
        let element = $('<div class="exceContain">' +
          '<div class="exceptionCircle"></div> ' +
          '<div class="exceptionWordContainer"></div> ' +
          '<div class="timeContainer"></div>' +
          '</div>')
        element.css({height: rectHeight, marginBottom: rectMargin})
        element.children(".exceptionWordContainer").html(appId + this.findErrorChnName(errorEngName))
        element.children(".timeContainer").html(time)
        elements.unshift(element)
        elements.length > 7 ? elements.pop() : void(0)
        elements.map(item => {
          $(item).css({top: 0})
          elementContainer.append(item)
        })
        elements.map(item => {
          item.animate({top: animate}, 500, 'linear', function () {
          })
        })
      }
    }
  }

  showNodeStatus(data) {
    const {messageSwitch} = this.state
    let list = JSON.parse(data)
    if (list && list.length) {
      this.setState({
        nodeStatus: list
      })
    }
  }

  showNodeInfo(data) {
    const {messageSwitch} = this.state
    let list = JSON.parse(data)
    let trueList = null
    if (list && list.length) {
      trueList = list.filter((item) => item.value != null)
    }
    if (trueList) {
      this.setState({
        nodeInfos: trueList
      })
    }
  }

  renderApp(list, location, ud, p, order) {
    let count = 3
    if (list.length < count || list.length == count) {
      return list.map((item, index) => {
        return <App app={item} ud={ud} layer={1} id={p + index}/>
      })
    }
    else {
      let divs = []
      let count = 3
      let layerOne = list.filter((item, index) => index < count)
      let layerTwo = list.filter((item, index) => index > (count - 1) && index < count * 2 + 1)
      layerOne.map((item, index) => {
        divs.push(<App app={item} ud={ud} layer={1}/>)
      })
      if (location == "left") {
        layerTwo.map((item, index) => {
          if (index == 0) {
            divs.push(<App app={item} ud={ud} layer={2} location='leftMiddle'/>)
          }
          else {
            divs.splice(count, 0, <App app={item} location={location} ud={ud} layer={2}/>)
          }
          count = count - 1
        })
      }
      else {
        let i = 0
        layerTwo.map((item, index) => {
          divs.splice(i, 0, <App app={item} location={i == 0 ? 'rightMiddle' : location} ud={ud} layer={2}/>)
          i = i + 2
        })
      }
      let result = []
      divs.map((item, index) => {
        let id = p + index
        result.push(<App app={item.props.app} location={item.props.location} ud={ud} layer={item.props.layer}
                         id={id}/>)
      })
      return result
    }
  }

  renderMiddleApp(app, location, ud) {
    return <App app={app} index='0' location={location} ud={ud} id={location}/>
  }

  renderNodes(data) {
    const {nodeStatus, nodeInfos} = this.state
    return data.map((item, index) => {
      if (index < 6) {
        if (nodeInfos && nodeInfos.length) {
          let info = nodeInfos.filter(it => it.name == item.name)[0]
          if (info && info.value) {
            return <Node ref={item.id} concurrentNum={1} node={item.name}/>
          }
          else {
            //节点异常返回红色
            return <Node ref={item.id} concurrentNum={1000} node={item.name}/>
          }
        }
        //初始红色
        // return <Node ref={item.id} concurrentNum={1} node={item.name}/>
        return <Node ref={item.id} concurrentNum={1000} node={item.name}/>
      }
    })
  }

  renderBorder() {
    const {appList} = this.state
    let topLeft, topRight, bottomLeft, bottomRight, topMiddle, bottomMiddle
    if (appList) {
      if (appList.topMiddle) {
        let div = document.getElementById("topMiddle")
        if (div) {
          topMiddle = div.offsetLeft
        }
      }
      if (appList.bottomMiddle) {
        let div = document.getElementById("bottomMiddle")
        if (div) {
          bottomMiddle = div.offsetLeft
        }
      }
      if (appList.topLeft && appList.topLeft.length) {
        let div = document.getElementById("topLeft0")
        if (div) {
          topLeft = div.offsetLeft
        }
      }
      if (appList.topRight && appList.topRight.length) {
        let i = appList.topRight.length - 1
        let div = document.getElementById(`topRight${i}`)
        if (div) {
          topRight = div.offsetLeft
        }
      }
      if (appList.bottomLeft && appList.bottomLeft.length) {
        let div = document.getElementById("bottomLeft0")
        if (div) {
          bottomLeft = div.offsetLeft
        }
      }
      if (appList.bottomRight && appList.bottomRight.length) {
        let i = appList.bottomRight.length - 1
        let div = document.getElementById(`bottomRight${i}`)
        if (div) {
          bottomRight = div.offsetLeft
        }
      }
    }
    let divs = []
    if (topLeft && !topRight) {
      let lineWidth = topMiddle - topLeft
      let left = topLeft + bodyWidth * 0.055 / 2
      let top = (bodyHeight - 20) * 0.09
      let height = (bodyHeight - 20) * 0.91 * 0.39 - 40
      divs.push(<div style={{
        position: 'absolute',
        width: lineWidth,
        left: left,
        top: top,
        height: height,
        borderBottom: '1px solid #3e93cc',
        margin: '20px 0 0'
      }}></div>)
    }
    else if (topLeft && topRight) {
      let lineWidth = topRight - topLeft
      let left = topLeft + bodyWidth * 0.055 / 2
      let top = (bodyHeight - 20) * 0.09
      let height = (bodyHeight - 20) * 0.91 * 0.39 - 40
      divs.push(<div style={{
        position: 'absolute',
        width: lineWidth,
        left: left,
        top: top,
        height: height,
        borderBottom: '1px solid #3e93cc',
        margin: '20px 0 0'
      }}></div>)
    }
    if (bottomRight && !bottomLeft) {
      let lineWidth = bottomRight - bottomMiddle
      let left = bottomMiddle + bodyWidth * 0.055 / 2
      let bottom = 20
      let height = (bodyHeight - 20) * 0.91 * 0.39 - 40
      divs.push(<div style={{
        position: 'absolute',
        width: lineWidth,
        left: left,
        bottom: bottom,
        height: height,
        borderTop: '1px solid #3e93cc',
        margin: '0 0 20px'
      }}></div>)
    }
    else if (bottomLeft && bottomRight) {
      let lineWidth = bottomRight - bottomLeft
      let left = bottomLeft + bodyWidth * 0.055 / 2
      let bottom = 20
      let height = (bodyHeight - 20) * 0.91 * 0.39 - 40
      divs.push(<div style={{
        position: 'absolute',
        width: lineWidth,
        left: left,
        bottom: bottom,
        height: height,
        borderTop: '1px solid #3e93cc',
        margin: '0 0 20px'
      }}></div>)
    }
    if (divs && divs.length) {
      return divs
    }
  }

  render() {
    const {tradingCount, appList, nodeInfos, tablespaces, node, messageSwitch, esHealth, datePeak} = this.state
    return (
      <div className={styles.body} style={{backgroundImage: 'url(application/img/background.png)'}}>
        <div className={styles.top}>
          <img className={styles.top_l} src="application/img/top_l.png"/>
          <div className={styles.top_m}>
            <div className={styles.title_u}>
              <img className={styles.p} src="application/img/new_title.png"/>
            </div>
            <div className={styles.title_d}>
              <img className={styles.dl} src="application/img/top_dl.png"/>
              <img className={styles.dl} src="application/img/top_dr.png"/>
            </div>
          </div>
          <img className={styles.top_l} src="application/img/top_r.png"/>
        </div>
        <div className={styles.bottom}>
          <div className={styles.left}>
            <Volume tradingCount={tradingCount} datePeak={datePeak}/>
            <Message displayCode={messageSwitch}/>
            <NodeAnalysis index={0} nodeInfos={nodeInfos} tablespaces={tablespaces} esHealth={esHealth}
                          speed={5000}/>
            <NodeAnalysis index={1} nodeInfos={nodeInfos} tablespaces={tablespaces} esHealth={esHealth}
                          speed={5000}/>
            {messageSwitch == 0 ?
              <NodeAnalysis index={2} nodeInfos={nodeInfos} tablespaces={tablespaces} esHealth={esHealth}
                            speed={5000}/> : void 0}
          </div>
          <div className={styles.right}>
            <div className={styles.appTop}>
              <div
                ref="topLeft"
                className={styles.topLeft}>{appList && appList.topLeft ? this.renderApp(appList.topLeft, 'left', 'top', 'topLeft') : void(0)}</div>
              {appList && appList.topMiddle ? this.renderMiddleApp(appList.topMiddle, 'topMiddle', 'top') : void(0)}
              <div
                ref="topRight"
                className={styles.topRight}>{appList && appList.topRight ? this.renderApp(appList.topRight, 'right', 'top', 'topRight') : void(0)}</div>
            </div>
            <div
              className={appList && appList.topMiddle && appList.topMiddle.statusCode ? styles.line : styles.none}></div>
            <div className={styles.nodeList} style={{backgroundImage: 'url(application/img/node_background.png)'}}>
              {node ? this.renderNodes(node) : void 0}
            </div>
            <div
              className={appList && appList.bottomMiddle && appList.bottomMiddle.statusCode ? styles.line : styles.none}></div>
            <div className={styles.appBottom}>
              <div
                ref="bottomLeft"
                className={styles.bottomLeft}>{appList && appList.bottomLeft ? this.renderApp(appList.bottomLeft, 'left', 'bottom', 'bottomLeft') : void(0)}</div>
              {appList && appList.bottomMiddle ? this.renderMiddleApp(appList.bottomMiddle, 'bottomMiddle', 'bottom') : void(0)}
              <div
                ref="bottomRight"
                className={styles.bottomRight}>{appList && appList.bottomRight ? this.renderApp(appList.bottomRight, 'right', 'bottom', 'bottomRight') : void(0)}</div>
            </div>
            {this.renderBorder()}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  ({
     monitor
   }) =>
    ({monitor})
)
(Index)
