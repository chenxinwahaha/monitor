/**
 * Created by 陈鑫 on 2018/5/31.
 */
import axios from 'axios'

const qs = require('qs')

export async function functions(payload) {
  return axios.post('/', payload)
}

export async function queryWorkList() {
  return axios.post('/app/queryWorkList')
}

export async function queryMonitorMessage() {
  return axios.post('/mobileApp/queryMonitorMessage')
}

export async function queryJobScheduleError() {
  return axios.post('/mobileApp/queryJobScheduleError')
}

export async function queryMonitorMessageByScroll(payload) {
  return axios.post('/mobileApp/queryMonitorMessageByScroll', payload)
}

export async function queryTodayMessageNum(payload) {
  return axios.post('/mobileApp/queryTodayMessageNum', payload)
}

export async function queryNodeInfo() {
  return axios.post('/mobile/queryNodeInfo')
}

export async function queryTransaction(payload) {
  return axios.post('/transaction/queryTransaction', payload)
}

export async function queryTransactionByDate(payload) {
  return axios.post('/transaction/queryTransactionByDateJianye', payload)
}

export async function monitorNode() {
  return axios.post('/transaction/monitorNode')
}

export async function queryTransactionByScroll(payload) {
  return axios.post('/transaction/queryTransactionByScroll', payload)
}

export async function queryFlowName() {
  return axios.post('/transaction/queryFlowName')
}

export async function queryAppName() {
  return axios.post('/mobileApp/queryAppList')
}

export async function queryTransactionByDateAndField(payload) {
  return axios.post('/transaction/queryTransactionByDateAndField', payload)
}

export async function selectIotBoxListByOrg() {
  return axios.post('/transaction/selectIotBoxListByOrgJianye')
}




