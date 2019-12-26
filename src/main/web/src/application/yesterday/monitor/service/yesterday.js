/**
 * FileName: yesterdayDetail
 * Author:   wxxx
 * Date:     2018/11/13 9:06 AM
 */

import axios from 'axios'

const qs = require('qs')

export async function queryYesterdayDetailById(payload) {
  return axios.post('/mobileApp/queryYesterdayDetailById', payload)
}

export async function queryYesterdayMessageNum(payload) {
  return axios.post('/mobileApp/queryYesterdayMessageNum', payload)
}

