import dva from 'dva';
import '../detail/detail.less'
import createLoading from 'dva-loading'
import 'moment/locale/zh-cn'
import 'antd-mobile/dist/antd-mobile.less'

// 1. Initialize
const app = dva();

app.use(createLoading());
// 2. Plugins
// config.use({});

// 3. Model
app.model(require('../detail/monitor/model/detail'))

// 4. Router
app.router(require('../detail/router'));

// 5. Start
app.start('#root');

