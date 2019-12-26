import React from "react";
import {Route, Router} from "dva/router";
import Index from './monitor/view/index'

function RouterConfig({history}) {
  return (
    <Router history={history}>
      <Route path="/" component={Index}>
      </Route>
    </Router>
  )
}

export default RouterConfig
