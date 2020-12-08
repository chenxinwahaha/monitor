/*
*  Created by  dhl  on 2018/6/1
*/


import * as service from '../service/appService'

export default {
  namespace: 'appModel',
  flowLoadError: null,
  sieIfList: [],
  sieIfList2: [],
  nodeList: [],
  type: '',
  allNumber: [],
  allNumber2: [],
  appList: [],
  state: {},
  node: [],
  reducers: {
    setState(state, action) {
      return {...state, ...action.payload}
    },
  },
  effects: {
    * functions({payload}, {call, put}) {
    },
    * queryFlowLoadError({payload, callback}, {call, put}) {
      const flowLoadError = yield call(service.queryFlowLoadError)
      yield put({
        type: "setState",
        payload: {
          flowLoadError: flowLoadError.data.payload
        }
      })
      callback()
    },

    * queryNodeList({payload}, {call, put}) {
      const nodeList = yield call(service.queryNodeList)
      yield put({
        type: "setState",
        payload: {
          nodeList: nodeList.data.payload
        }
      })
    },
    * queryNode({payload}, {call, put}) {
      const nodeList = yield call(service.queryNodeList)
      yield put({
        type: "setState",
        payload: {
          node: nodeList.data.payload
        }
      })
    },

    * querySieIfList({payload}, {call, put}) {
      const sieIfList = yield call(service.querySieIfList)
      yield put({
        type: "setState",
        payload: {
          sieIfList: sieIfList.data.payload
        }
      })
    },

    * querySieIfList2({payload}, {call, put}) {

      const sieIfList = yield call(service.querySieIfList)
      const sieIfList2 = sieIfList.data.payload
      sieIfList2.map(group => {
        group.type = 'child'
        group.parentId = group.groupId
      })
      yield put({
        type: "setState",
        payload: {
          sieIfList2
        }
      })
    },

    * loadAllApp({}, {call, put, select}) {
      const {data} = yield call(service.queryAppList)
      if (data.code === 0) {
        alert("查询应用", data)
      }
      yield put({type: 'setState', payload: {appList: data.payload}})
    },

    * queryAllNumber({payload}, {call, put}) {
      const allNumber = yield call(service.queryAllNumber, payload)
      yield put({
        type: "setState",
        payload: {
          allNumber: allNumber.data.payload
        }
      })
    },

    * queryAllNumber2({payload}, {call, put}) {
      const allNumber = yield call(service.queryAllNumber, payload)
      yield put({
        type: "setState",
        payload: {
          allNumber2: allNumber.data.payload
        }
      })
    }
  }
}
