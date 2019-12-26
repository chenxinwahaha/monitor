/**
 * FileName: detail
 * Author:   wxxx
 * Date:     2018/10/29 11:07 AM
 */
import axios from 'axios'

const qs = require('qs')

export async function queryTransactionHistory(payload) {
  return axios.post('/transaction/queryTransactionHistory', payload)
}
export async function queryDetailById(payload) {
  return axios.post('/mobileApp/queryDetailById', payload)
}
