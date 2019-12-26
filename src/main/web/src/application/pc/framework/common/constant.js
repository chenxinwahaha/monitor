/**
 * Created by Winna on 8/11/17.
 */
// const type = [{CODE: 1, NAME: '按年'}, {CODE: 2, NAME: '按月'}, {CODE: 3, NAME: '按周'},
//   {CODE: 4, NAME: '按天'}, {CODE: 5, NAME: '按时'}, {CODE: 6, NAME: '按分'},{CODE:7,NAME:'自定义'}]
const type = [{CODE: 1, NAME: '按分'}, {CODE: 2, NAME: '按时'}, {CODE: 3, NAME: '按天'},
  {CODE: 4, NAME: '按周'}, {CODE: 5, NAME: '按月'}, {CODE: 6, NAME: '按年'},{CODE:7,NAME:'自定义'}]
let months = []
for (let i = 1; i <= 12; i++) {
  months.push({CODE: i, NAME: `${i}月`})
}
let days = []
for (let i = 1; i <= 31; i++) {
  days.push({CODE: i, NAME: `${i}日`})
}
const weekDays = [{CODE: 1, NAME: '周一'}, {CODE: 2, NAME: '周二'}, {CODE: 3, NAME: '周三'},
  {CODE: 4, NAME: '周四'}, {CODE: 5, NAME: '周五'}, {CODE: 6, NAME: '周六'}, {CODE: 7, NAME: '周日'}]
export default {
  type,
  months,
  days,
  weekDays
}
