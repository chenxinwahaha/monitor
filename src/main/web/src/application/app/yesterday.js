/**
 * FileName: yesterday
 * Author:   wxxx
 * Date:     2018/11/13 9:03 AM
 */

import dva from 'dva';
import '../yesterday/yesterday.less'
import createLoading from 'dva-loading'
import 'moment/locale/zh-cn'
import 'antd-mobile/dist/antd-mobile.less'

// 1. Initialize
const app = dva();

app.use(createLoading());
// 2. Plugins
// config.use({});

// 3. Model
app.model(require('../yesterday/monitor/model/yesterday'))
app.model(require('../mobile/monitor/model/mobile'))
// 4. Router
app.router(require('../yesterday/router'));

// 5. Start
app.start('#root');

