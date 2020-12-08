/**
 * Created by 陈鑫 on 2018/5/31.
 */
import axios from 'axios'

const qs = require('qs')

export async function queryMobileNodeInfo() {
    return axios.post('/mobile/queryMobileNodeInfo')
}

export async function queryMobileTablespaceInfo() {
  return axios.post('/mobile/queryMobileTablespaceInfo')
}
export async function queryMobileElasticSearchHealth() {
  return axios.post('/mobile/queryMobileElasticSearchHealth')
}

export async function queryNodeTranscation() {
  return axios.post('/mobile/queryNodeTranscation')
}







