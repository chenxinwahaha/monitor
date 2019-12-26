/*
 * Created by dhl 2018  on 6/1
 */
import React, {Component} from 'react'
import {List, Toast, ActivityIndicator} from 'antd-mobile';
import {connect} from 'dva'
import style from './index.less'
import DataModal from '../../../component/AppDataModal/index'
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
      selectBar: 'app',
      pictureStatus: "0",
      load: "app",
      timeStatus: "0"
    };
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch({type: "appModel/loadAllApp"}).then(() => {
      dispatch({type: 'appModel/querySieIfList2'}).then(() => {
        const {appList, sieIfList2} = this.props.appModel
        let sieIfList = sieIfList2
        dispatch({type: "appModel/queryAllNumber", payload: {appList, sieIfList, type: 'publish-queue'}}).then(() => {
          this.setState({timeStatus: "1"})
        })
      })
    })
  }

  componentWillUnmount() {
    clearTimeout((this.timeoutId))
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

  selectColor(name) {
    const {selectBar} = this.state
    if (name == selectBar) {
      let color = {color: "#0085e8", borderBottom: '#0085e8', borderStyle: 'solid', borderWidth: '0.2rem'}
      return color
    }
  }

  clickData(item) {
    const {modalVisible, modalContent, selectBar} = this.state
    if (selectBar === "app") {
      this.setState({load: "if"})
      modalContent.push({title: '应用名', content: item.app.name, type: "0"})
      modalContent.push({title: '应用ID', content: item.app.id, type: "0"})
      modalContent.push({title: '阻塞数', content: item.total, type: "0"})
      modalContent.push({title: '阻塞的集成流', content: '阻塞的集成流ID', type: "1"})
      item.if.map((detail, index) =>
        modalContent.push({title: detail.name, content: detail.id, type: "2"})
      )
      this.setState({load: "if"})
    } else {
      this.setState({load: "app"})
      modalContent.push({title: '集成流名', content: item.if.name, type: "0"})
      modalContent.push({title: '集成流ID', content: item.if.id, type: "0"})
      modalContent.push({title: '阻塞数', content: item.total, type: "0"})
      modalContent.push({title: '阻塞的应用名', content: '阻塞的应用ID', type: "1"})
      item.app.map((detail, index) =>
        modalContent.push({title: detail.name, content: detail.id, type: "2"})
      )
    }

    this.setState({modalContent}, () => {
      this.setState({modalVisible: !modalVisible})
    })

  }

  getContent(selectNumber) {
    const {selectBar} = this.state
    let status = "阻塞总数"
    let color = "red"
    let pictureUrl = "./application/mobile/publish_queue_circle.png"
    if (selectNumber && selectBar === "app") {
      return (selectNumber.map((item, index) =>
        <div key={index} onClick={() => {
          this.clickData(item)
        }}>
          <DataInfo name={item.app.name} status={status} current={item.app.id} time={item.total} pictureUrl={pictureUrl}
                    color={color}/>
        </div>
      ))
    } else if (selectNumber && selectBar === "if") {
      return (selectNumber.map((item, index) =>
        <div key={index} onClick={() => {
          this.clickData(item)
        }}>
          <DataInfo name={item.if.name} status={status} current={item.if.id} time={item.total} pictureUrl={pictureUrl}
                    color={color}/>
        </div>
      ))
    }
  }

  clickChange() {
    this.setState({pictureStatus: "1"})
  }

  getData(selectNumber) {
    return this.getContent(selectNumber)
  }

  render() {
    const {selectBar, modalVisible, modalContent, load} = this.state
    const {allNumber} = this.props.appModel
    let selectNumber = null
    if (allNumber) {
      for (var k in allNumber) {  //通过定义一个局部变量k遍历获取到了map中所有的key值
        if (k === selectBar) {
          selectNumber = allNumber[k]
        }
      }
    }
    return (
      <div className={style.head}>
        <div className={style.select}>
          <div className={style.bar}>
            <div className={style.name} style={{color: selectBar === 'app' ? '#0085e8' : '#000000'}} onClick={() => {
              this.setState({selectBar: "app"})
            }}>应用
            </div>
            <div className={selectBar === 'app' ? style.line : style.line1}></div>
          </div>
          <div className={style.bar}>
            <div className={style.name} style={{color: selectBar === 'if' ? '#0085e8' : '#000000'}} onClick={() => {
              this.setState({selectBar: "if"})
            }}>集成流
            </div>
            <div className={selectBar === 'if' ? style.line : style.line1}></div>
          </div>
        </div>

        <div className={style.data}>
          {
            selectNumber && selectNumber.length ? this.getData(selectNumber) : this.setTime()
          }
        </div>

        <DataModal modalVisible={modalVisible} content={modalContent} load={load} closeModal={() => {
          this.setState({modalVisible: !modalVisible, modalContent: []})
        }}/>
      </div>

    )
  }
}

export default connect((appModel) => (appModel))(Index)

