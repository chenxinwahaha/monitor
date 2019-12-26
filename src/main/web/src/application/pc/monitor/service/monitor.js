/**
 * Created by 陈鑫 on 2018/4/4.
 */
import axios from 'axios'

export async function queryAppList() {
  return axios.post('/app/queryAppList')
}

export async function queryApps() {
  return axios.post('app/queryApps')
}
export async function tradingCount() {
  return axios.post('app/tradingCount')
}
export async function queryYesterdayDynamic() {
  return axios.post('app/queryYesterdayDynamic')
}
export async function queryElasticSearchHealth() {
  return axios.post('app/queryElasticSearchHealth')
}
export async function queryTablespaceInfo() {
  return axios.post('app/queryTablespaceInfo')
}
export async function queryNode() {
  return axios.post('app/queryNode')
}
export async function queryPeakByDate() {
  return axios.post('app/queryPeakByDate')
}
export async function queryYesterdayNodeInfo() {
  return axios.post('app/queryYesterdayNodeInfo')
}

export async function runTask() {
  return axios.post('app/runTask')
}
