/**
 * Created by 陈鑫 on 2018/4/4.
 */
import alert from '../../framework/common/alert'
import * as service from '../service/monitor'

export default {
  namespace: 'monitor',

  state: {
    appListTest: [{name: '应用一', statusCode: '1', shortName: '1'}, {
      name: '应用一',
      statusCode: '1',
      shortName: '1'
    }, {name: '应用一', statusCode: '1', shortName: '1'}, {name: '应用一', statusCode: '1', shortName: '1'}, {
      name: '应用一',
      statusCode: '1',
      shortName: '1'
    }, {name: '应用一', statusCode: '1', shortName: '1'}, {name: '应用一', statusCode: '1', shortName: '1'}, {
      name: '应用一',
      statusCode: '1',
      shortName: '1'
    }],
  },
  reducers: {
    setState(state, action) {
      return {...state, ...action.payload}
    },
  },
  effects: {
    * runTask({payload}, {call, put}) {
      yield call(service.runTask)
    },
    * queryAppList({payload}, {call, put}) {
      const {data} = yield call(service.queryAppList)
      if (data.code === 0) {
        alert("查询应用", data)
      }
      else {
        let list = data.payload
        let topList, bottomList, topMiddle, topLeft, topRight, bottomMiddle, bottomLeft, bottomRight
        if (list && list.length) {
          let length = list.length
          if (length % 2 != 0) {//集合为偶数
            topList = list.filter((item, index) => index < (length + 1) / 2)
            bottomList = list.filter(index => index > (length - 1) / 2)
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
              if (length % 2 != 0) {//集合为偶数
                topLeft = list.filter((item, index) => index < (length + 1) / 2)
                topRight = list.filter(index => index > (length - 1) / 2)
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
              if (length % 2 != 0) {//集合为偶数
                bottomLeft = list.filter((item, index) => index < (length + 1) / 2)
                bottomRight = list.filter(index => index > (length - 1) / 2)
              }
              else {
                bottomLeft = list.filter((item, index) => index < (length) / 2)
                bottomRight = list.filter((item, index) => index > (length - 2) / 2)
              }
            }
          }
          yield put({
            type: 'setState',
            payload: {
              appTopMiddle: topMiddle,
              appListTopLeft: topLeft,
              appListTopRight: topRight,
              appBottomMiddle: bottomMiddle,
              appListBottomLeft: bottomRight,
              appListBottomRight: bottomLeft
            }
          })
        }
      }
    },
  }
}
