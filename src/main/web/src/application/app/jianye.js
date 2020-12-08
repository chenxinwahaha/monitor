import dva from 'dva';
import '../mobile/mobile.less'
import {message} from 'antd'
import createLoading from 'dva-loading'
import 'moment/locale/zh-cn'
import 'antd-mobile/dist/antd-mobile.less'

// 1. Initialize
// 1. Initialize
const app = dva();

app.use(createLoading());
// 2. Plugins
// config.use({});

// 3. Model
app.model(require('../jianye/monitor/model/mobile'))
app.model(require('../jianye/monitor/model/appModel'))
app.model(require('../jianye/monitor/model/node'))
// 4. Router
app.router(require('../jianye/router'));

// 5. Start
app.start('#root');

