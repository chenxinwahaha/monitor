import dva from 'dva';
import '../pc/pc.less'
import {message} from 'antd'
import createLoading from 'dva-loading'
import 'moment/locale/zh-cn'

// 1. Initialize
// 1. Initialize
const app = dva();

app.use(createLoading());
// 2. Plugins
// config.use({});

// 3. Model
app.model(require('../pc/monitor/model/monitor'));

// 4. Router
app.router(require('../pc/router'));

// 5. Start
app.start('#root');

