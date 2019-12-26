/**
 * Created by 陈鑫 on 2018/5/31.
 * dhl 2018  on 6/1
 */
import React, {Component} from 'react'
import {Grid} from 'antd-mobile';
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import style from './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {

  }

  clickChoose(e){
    const {dispatch} = this.props
    dispatch(routerRedux.push({
      pathname: e.type,
      query: {},
    }));
  }

  render() {
    const dataInfo = [{icon: "./application/mobile/publish_queue_circle.png", text: "发布队列",type:"publishQueue" },
      {icon: "./application/mobile/push_queue_circle.png", text: "推送队列",type:"pushQueue" },
      {icon: "./application/mobile/timing_operation_circle.png", text: "定时作业",type:"timingOperation" },
      {icon: "./application/mobile/integrated_flow_loading_failure_circle.png", text: "集成流加载失败",type:"integratedFlow" }]
    return (
      <div className={style.head}>
        <div className={style.first}><img src="./application/mobile/banner_02.png" className={style.titleImg}/></div>
        <div>
          <Grid data={dataInfo} columnNum={3}   hasLine={false}
          onClick ={(e) =>this.clickChoose(e)}
          />
        </div>

      </div>
    )
  }
}

export default connect((appModel)=>(appModel))(Index)
