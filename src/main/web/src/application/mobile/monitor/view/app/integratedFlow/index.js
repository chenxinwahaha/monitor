/*
 * Created by dhl 2018  on 6/1
 */
import React, {Component} from 'react'
import {ActivityIndicator, Toast, List} from 'antd-mobile';
import {connect} from 'dva'
import style from './index.less'
import DataModal from '../../../component/DataModal/index'
import DataInfo from '../../../component/DataList/index.js'

const Item = List.Item;
const Brief = Item.Brief;

class Index extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false,
      modalContent: [],
      selectInfo: null,
      nodeId: '',
      nodeIdList: [],
      timeStatus: "0"
    };
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch({type: 'appModel/queryNodeList'})
    dispatch({type: 'appModel/querySieIfList'})
    dispatch({
      type: 'appModel/queryFlowLoadError', callback: () => {
        let nodeList = this.nodeSelect()
        this.setState({
          timeStatus: "1",
          nodeId: nodeList && nodeList.length > 0 ? nodeList[0].nodeId : '',
          nodeIdList: nodeList
        })
      }
    })
  }

  componentWillUnmount() {
    clearTimeout((this.timeoutId))

  }

  componentWillMount() {
    const {dispatch} = this.props
    let nodeList = this.nodeSelect()
    nodeList && nodeList.length > 0 ? this.setState({nodeId: nodeList[0].nodeId, nodeIdList: nodeList}) : ''
  }

  getTimeAndStatus(item) {
    return (
      <div>
        <div style={{color: 'red', lineHeight: "4.9rem", fontSize: "2.8rem"}}>加载异常</div>
        <div>{item.time.substring(6)}</div>
      </div>
    )
  }

  clickData(item) {
    const {modalVisible, modalContent} = this.state
    let contentList = []
    contentList.push({title: '节点', content: item.nodeName + "(" + item.nodeId + ")"})
    contentList.push({title: '集成流', content: item.name + "(" + item.id + ")"})
    contentList.push({title: '发送时间', content: item.time})
    contentList.push({title: '状态', content: '加载失败'})
    contentList.push({title: 'error', content: item.exception})
    this.setState({modalContent: contentList}, () => {
      this.setState({modalVisible: !modalVisible})
    })
  }

  getData(allInfo) {
    let status = "加载失败"
    let pictureUrl = "./application/mobile/integrated_flow_loading_failure_circle.png"
    return (allInfo.map((item, index) =>
      <div key={index} onClick={() => {
        this.clickData(item)
      }}>
        <DataInfo name={item.name} status={status} current={item.nodeName} time={item.time} pictureUrl={pictureUrl}/>
      </div>
    ))
  }

  nodeSelect() {
    const {flowLoadError} = this.props.appModel
    let dataGroup = []
    let dateGroupName = []
    if (flowLoadError && flowLoadError.length > 0) {
      for (let i = 0; i < flowLoadError.length; i++) {
        if (!dataGroup[flowLoadError[i].source.nodeId]) {
          let arr = [];
          arr.push(flowLoadError[i]);
          dataGroup[flowLoadError[i].source.nodeId] = arr;
          dateGroupName.push(flowLoadError[i].source.nodeId)
        } else {
          dataGroup[flowLoadError[i].source.nodeId].push(flowLoadError[i])
        }
      }
    }
    let datas = []
    dateGroupName.map((item) => {
      let data = {nodeId: item, size: dataGroup[item].length}
      datas.push(data)
    })
    return datas
  }

  setTime() {
    const {timeStatus} = this.state
    if (timeStatus === "0") {
      return <div><ActivityIndicator toast text="请稍等"/></div>
    } else {
      return (
        <div className={style.errorPage}>
          <div className={style.part}>
            <img src="./application/mobile/no_data.png"/>
            <span>暂时未查到数据</span>
          </div>
        </div>)
    }
  }

  render() {
    const {flowLoadError, sieIfList, nodeList} = this.props.appModel
    const {modalVisible, modalContent, nodeIdList, nodeId} = this.state
    let info = "./application/mobile/integrated_flow_loading_failure_circle.png"
    let infoList = []
    let allInfo = []
    let flowHead = document.getElementById("flowHead")
    let flowSelect = document.getElementById("flowSelect")
    let flowData = null
    if (flowHead && flowSelect) {
      flowData = flowHead.offsetHeight - flowSelect.offsetHeight
    }
    if (flowLoadError && sieIfList && nodeList) {
      flowLoadError.map(item => {
        infoList.push(item.sourceAsMap)
      })
      infoList.map(item => {
        let oneInfo = {}
        oneInfo["id"] = item.id
        oneInfo["nodeId"] = item.nodeId
        oneInfo["time"] = item.date
        oneInfo["exception"] = item.exception
        sieIfList.map(detail => {
            if (item.id === detail.id) {
              oneInfo["name"] = detail.name
            }
          }
        )
        nodeList.map(nodeItem => {
          if (item.nodeId === nodeItem.id) {
            oneInfo["nodeName"] = nodeItem.name
          }
        })
        allInfo.push(oneInfo)
      })
    }
    let filterNodeAllInfo = allInfo.filter((item) => item.nodeId == nodeId)
    if (filterNodeAllInfo && filterNodeAllInfo.length > 0) {
      return (
        <div className={style.head} id="flowHead">
          <div className={style.select} id="flowSelect">
            {nodeIdList && nodeIdList.length > 0 ? nodeIdList.map((item, index) => {
              return (
                <div className={style[nodeId == item.nodeId ? "nodeSelect" : "node"]}
                     key={index}
                     onClick={() => {
                       this.setState({nodeId: item.nodeId})
                     }}
                >
                  {item.nodeId}({item.size})</div>
              )
            }) : void(0)}
          </div>
          <div className={style.data} style={{height: flowData ? flowData : 'auto'}}>
            {
              this.getData(filterNodeAllInfo)
            }
          </div>
          <DataModal modalVisible={modalVisible} content={modalContent} title='数据详情' closeModal={() => {
            this.setState({modalVisible: !modalVisible, modalContent: []})
          }}/>
        </div>
      )
    }
    else {
      return this.setTime()
    }

  }
}

export default connect((appModel) => (appModel))(Index)
