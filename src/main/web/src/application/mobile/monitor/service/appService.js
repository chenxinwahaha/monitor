/*
*  Created by  dhl  on 2018/6/1
*/

import axios from 'axios'

const qs = require('qs')

export async function queryFlowLoadError() {
  return axios.post('/mobileApp/queryFlowLoadError')
}
export async function queryNodeList() {
  return axios.post('/mobileApp/queryNodeList')
}
export async function querySieIfList() {
  return axios.post('/mobileApp/querySieIfList')
}
export async function queryAllNumber(param) {
  return axios.post('/mobileApp/queryAllNumber',param)
}
export async function queryAppList() {
  return axios.post('/mobileApp/queryAppList')
}
