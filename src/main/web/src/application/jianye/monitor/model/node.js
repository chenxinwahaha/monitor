/**
 * Created by 陈鑫 on 2018/5/31.
 */
import * as node from '../service/node'

export default {
  namespace: 'node',

  state: {
    nodeInfo: [],
    tableSpace: [],
    esHealth: {},
    nodeTranscation: null,
  },
  reducers: {
    setState(state, action) {
      return {...state, ...action.payload}
    },
  },
  effects: {
    * functions({payload}, {call, put}) {
    },

    * queryMobileNodeInfo({}, {call, put}) {
      const {data} = yield call(node.queryMobileNodeInfo)
      yield put({type: 'setState', payload: {nodeInfo: data.payload}})
    },

    * queryMobileTablespaceInfo({callback}, {call, put}) {
      const {data} = yield call(node.queryMobileTablespaceInfo)
      yield put({type: 'setState', payload: {tableSpace: data.payload}})
      callback()
    },

    * queryMobileElasticSearchHealth({}, {call, put}) {
      const {data} = yield call(node.queryMobileElasticSearchHealth)
      yield put({type: 'setState', payload: {esHealth: data.payload}})
    },

    * queryNodeTranscation({}, {call, put}) {
      const {data} = yield call(node.queryNodeTranscation)
      yield put({type: 'setState', payload: {nodeTranscation: data.payload}})
    },

  }
}
