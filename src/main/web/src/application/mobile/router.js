import React from "react";
import {Route, Router} from "dva/router";

import Index from './monitor/view/index'
import Info from './monitor/view/Info/index'
import Message from './monitor/view/message/index'
import ErrorList from './monitor/view/message/list/index'
import App from './monitor/view/app/index'
import TimingOperation from './monitor/view/app/TimingOperation/index.js'
import Node from './monitor/view/node/index'
import IntegratedFlow from './monitor/view/app/integratedFlow/index'
import PublishQueue from './monitor/view/app/PublishQueue/index'
import PushQueue from './monitor/view/app/PushQueue/index'
import HomePage from './monitor/view/homePage/index'
import TransactionDetail from './monitor/view/homePage/transactionDetail/index'
import TransactionDetailFoldLine from './monitor/view/homePage/transactionDetailFoldLine/index'

function RouterConfig({history}) {
  return (
    <Router history={history}>
      <Route path="/" component={Index}>
        <Route path="/info" component={Info}/>
        <Route path="/message" component={Message}/>
        <Route path="/app" component={App}/>
        <Route path="/node" component={Node}/>
        <Route path="/homePage" component={HomePage}/>
        <Route path="/transactionDetail" component={TransactionDetail}/>
        <Route path="/transactionDetailFoldLine" component={TransactionDetailFoldLine}/>
        <Route path="/timingOperation" component={TimingOperation}/>
        <Route path="/integratedFlow" component={IntegratedFlow}/>
        <Route path="/publishQueue" component={PublishQueue}/>
        <Route path="/pushQueue" component={PushQueue}/>
        <Route path="/errorList" component={ErrorList}/>
      </Route>
    </Router>
  )
}

export default RouterConfig
