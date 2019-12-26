/**
 * Created by 陈鑫 on 2018/5/31.
 */
import React, {Component} from 'react'
import {connect} from 'dva'
import NodeCard from "./nodeCard/index.js"
import styles from './index.less'
import TablespaceCard from "./tablespaceCard/index.js"
import ElasticSearch from "./elasticSearch/index.js"

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch({type: 'node/queryMobileNodeInfo'})
    dispatch({type: 'node/queryNodeTranscation'})
    dispatch({type: "appModel/queryNode"})
  }

  renderNode(value) {
    if (value && value.length) {
      return value.map((nodeIf, index) => {
        if (null !== nodeIf) {
          return (
            <NodeCard nodeIf={nodeIf} key={index}/>
          )
        }
      })
    }
  }

  sortNodeInfo(list) {
    return list.sort(function (x, y) {
      if (null !== x && null !== y) {
        if (x.value && y.value) {
          if (x.name > y.name) {
            return 1;
          } else if (x.name === y.name) {
            return x.a > y.a ? 1 : -1;
          } else if (x.name < y.name) {
            return -1;
          }
        }
        else {
          if (!x.value) {
            return 1;
          }
          else if (!y.value) {
            return -1;
          }
        }
      }
    })
  }

  render() {
    const {nodeInfo} = this.props.node
    const {node} = this.props.appModel
    const {esHealth} = this.props.node
    return (
      <div className={styles.total}>
        {nodeInfo && nodeInfo.length ? this.renderNode(this.sortNodeInfo(nodeInfo)) : this.renderNode(node)}
        <ElasticSearch esHealth={esHealth}/>
        <TablespaceCard/>
      </div>
    )
  }
}

export default connect(({node, appModel}) => ({node, appModel}))(Index)
