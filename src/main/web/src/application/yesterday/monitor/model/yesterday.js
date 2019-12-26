/**
 * FileName: yesterdayDetail
 * Author:   wxxx
 * Date:     2018/11/13 9:05 AM
 */

import * as service from '../service/yesterday'

export default {
  namespace: 'yesterday',

  state: {
    yesterdayDetail: null,
    num: null,
    nameNumMap: null
  },

  reducers: {
    setState(state, action) {
      return {...state, ...action.payload}
    },
  },

  effects: {
    * functions({payload}, {call, put}) {
    },

    * queryYesterdayDetailById({payload}, {call, put}) {
      const {data} = yield call(service.queryYesterdayDetailById, payload)
      let yesterday
      if (data && data.code == 1) {
        yesterday = data.payload.value
      }
      else {
        yesterday = ""
      }
      yield put({type: 'setState', payload: {yesterdayDetail: yesterday}})
    },
    * queryYesterdayMessageNum({payload, callback}, {call, put}) {
      const {data} = yield call(service.queryYesterdayMessageNum, payload)
      yield put({type: 'setState', payload: {num: data.payload}})
      callback()
    }
  }
}

