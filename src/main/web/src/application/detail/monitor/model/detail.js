/**
 * FileName: detail
 * Author:   wxxx
 * Date:     2018/10/29 11:04 AM
 */
import * as service from '../service/detail'

export default {
  namespace: 'detail',

  state: {
    historyInfo: [],
    detail: null
  },

  reducers: {
    setState(state, action) {
      return {...state, ...action.payload}
    },
  },

  effects: {
    * functions({payload}, {call, put}) {
    },

    * queryTransactionHistory({payload}, {call, put}) {
      const {data} = yield call(service.queryTransactionHistory, payload)
      yield put({type: 'setState', payload: {historyInfo: data.payload}})
    },
    * queryDetailById({payload}, {call, put}) {
      const {data} = yield call(service.queryDetailById, payload)
      let detail
      if (data && data.code == 1) {
        detail = data.payload
      }
      else {
        detail = ""
      }
      yield put({type: 'setState', payload: {detail: detail}})

    }
  }
}

