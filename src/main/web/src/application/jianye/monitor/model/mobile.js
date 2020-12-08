/**
 * Created by 陈鑫 on 2018/5/31.
 */
import * as service from '../service/mobile'
import * as node from "../service/node";

export default {
  namespace: 'mobile',

  state: {
    workList: [],
    messageList: [],
    jobScheduleError: [],
    errorList: [],
    num: '',
    schedulerList: [],
    totalTransaction: '',
    successTransaction: '',
    errorTransaction: '',
    todayTransactionInfo: [],
    yesterdayTransactionInfo: [],
    thisWeekTransactionInfo: [],
    singleTodayTransactionInfo: [],
    singleYesterdayTransactionInfo: [],
    singleThisWeekTransactionInfo: [],
    monitorList: null,
    ifEsList: [],
    appEsList: [],
    flowNameList: [],
    appNameList: [],
    selectFlow: "",
    selectApp: "",
    selectType: "",
    name: '',
    selectHour: null,
    homepageSelectDate: "今日",
    inHome: null,
    listIsNull: 0,
    esList: null,
    selectRadio: "if",
    queryDone: false,
    boxList: null
  },
  reducers: {
    setState(state, action) {
      return {...state, ...action.payload}
    },
  },
  effects: {
    * queryWorkList({}, {call, put}) {
      const {data} = yield call(service.queryWorkList)
      yield put({type: 'setState', payload: {workList: data.payload}})
    },
    * queryMonitorMessage({callback}, {call, put}) {
      const {data} = yield call(service.queryMonitorMessage)
      yield put({type: 'setState', payload: {messageList: data.payload}})
      callback()
    },
    * queryJobScheduleError({callback}, {call, put}) {
      const {data} = yield call(service.queryJobScheduleError)
      yield put({type: 'setState', payload: {jobScheduleError: data.payload}})
      callback()
    },
    * queryMonitorMessageByScroll({payload, callback}, {call, put, select}) {
      const {data} = yield call(service.queryMonitorMessageByScroll, payload)
      const errorList = yield select(state => state.mobile.errorList)
      if (errorList.length > 0 && errorList[0].sourceAsMap.code == payload.codeId) {
        yield put({type: 'setState', payload: {errorList: errorList.concat(data.payload)}})
      } else {
        yield put({type: 'setState', payload: {errorList: data.payload}})
      }
      callback()
    },
    * queryTodayMessageNum({payload}, {call, put}) {
      const {data} = yield call(service.queryTodayMessageNum, payload)
      yield put({type: 'setState', payload: {num: data.payload}})
    },
    * queryNodeInfo({}, {call, put}) {
      const {data} = yield call(service.queryNodeInfo)
      yield put({type: 'setState', payload: {schedulerList: data.payload}})
    },
    * queryTransaction({payload}, {call, put}) {
      const {data} = yield call(service.queryTransaction, payload)
      var transactionMap = eval("(" + data.payload + ")");
      //全部
      var totalTransactionContent = (transactionMap && transactionMap.aggregations && transactionMap.aggregations.agg && transactionMap.aggregations.agg.buckets && transactionMap.aggregations.agg.buckets.length ? transactionMap.aggregations.agg.buckets[0].doc_count : 0)
      //正常，异常
      var normalTransaction = null !== transactionMap && transactionMap.aggregations && transactionMap.aggregations.agg && transactionMap.aggregations.agg.buckets && transactionMap.aggregations.agg.buckets.length ? transactionMap.aggregations.agg.buckets[0].transaction.buckets : []
      var successTransactionContent = normalTransaction.length && (normalTransaction.filter(item =>
        item.key == "SUCCESS"
      )).length ? normalTransaction.filter(item =>
        item.key == "SUCCESS"
      )[0].doc_count : 0
      var errorTransactionContent = normalTransaction.length && (normalTransaction.filter(item =>
        item.key == "ERROR")).length ? normalTransaction.filter(item =>
        item.key == "ERROR"
      )[0].doc_count : 0
      yield put({
        type: 'setState', payload: {
          totalTransaction: successTransactionContent + errorTransactionContent,
          successTransaction: successTransactionContent,
          errorTransaction: errorTransactionContent
        }
      })
    },
    //全部交易量的折线图数据
    * queryTransactionByDate({payload}, {call, put}) {
      const {data} = yield call(service.queryTransactionByDate, payload)
      yield put({type: 'setState', payload: {monitorList: data.payload}})
    },
    * monitorNode({}, {call, put}) {
      const {data} = yield call(service.monitorNode)
      yield put({type: 'setState', payload: {monitorList: data.payload}})
    },
    * queryTransactionByScroll({payload, callback}, {call, put}) {
      const {data} = yield call(service.queryTransactionByScroll, payload)
      if (data && data.code != 0) {
        yield put({
          type: 'setState',
          payload: {esList: data.payload}
        })
      }
      callback()
    },
    * queryFlowName({}, {call, put}) {
      const {data} = yield call(service.queryFlowName)
      yield put({type: 'setState', payload: {flowNameList: data.payload}})
    },
    * queryAppName({}, {call, put}) {
      const {data} = yield call(service.queryAppName)
      yield put({type: 'setState', payload: {appNameList: data.payload}})
    },
    * selectIotBoxListByOrg({}, {call, put}) {
      const {data} = yield call(service.selectIotBoxListByOrg)
      yield put({type: 'setState', payload: {boxList: data.payload}})
    },
    * queryTransactionByDateAndField({payload}, {call, put}) {
      const {data} = yield call(service.queryTransactionByDateAndField, payload)
      switch (payload.type) {
        case 1:
          yield put({
            type: 'setState',
            payload: {singleTodayTransactionInfo: null !== data.payload ? data.payload : []}
          })
          break
        case 2:
          yield put({
            type: 'setState',
            payload: {singleYesterdayTransactionInfo: null !== data.payload ? data.payload : []}
          })
          break
        case 3:
          yield put({
            type: 'setState',
            payload: {singleThisWeekTransactionInfo: null !== data.payload ? data.payload : []}
          })
          break
      }
    }
  }
}
