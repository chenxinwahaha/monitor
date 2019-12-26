/**
 * Created by 陈鑫 on 2018/4/9.
 */
import React, {Component} from 'react'
import styles from './app.less'

const width = document.body.clientWidth
const height = document.body.clientHeight
const paddingWidth = -((width - 40) * 0.75 - 40) * 0.01
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bool:true
    }
  }

  componentDidMount() {

  }

  selectStyle(location, layer) {
    if (location == "topMiddle" || location == "bottomMiddle") {
      return styles.body
    }
    else if (layer == 1) {
      return styles.body_down
    }
    else {
      return styles.body_up
    }
  }

  renderBox(ud, p) {
    const {app} = this.props
    if (ud == p) {
      return < div id={app.id} className={app.statusCode == 1 ? styles.line : styles.line_error}>
        <style>
          {`
                          .normalPoint{
                             position: absolute;
                             border-radius: 50%;
                             height: 5px;
                             width: 5px;
                             background: #2AFC30;
                             box-shadow: 0 0 5px 1px #2AFC30;
                             z-index: 11;
                            }
                          .abnormalPoint{
                             position: absolute;
                             border-radius: 50%;
                             height: 5px;
                             width: 5px;
                             background: rgb(255,67,92);
                             box-shadow: 0 0 5px 1px rgb(255,67,92);
                             z-index: 11;
                            }
                          `}
        </style>
      </div>
    }
  }

  render() {
    const {app, location, ud, layer, id} = this.props
    return (
      <div className={this.selectStyle(location, layer)}
           id={id}
           style={{
             width: width * 0.055,
             marginRight: location == 'left' || location == 'right' || location == 'rightMiddle' ? paddingWidth : 0,
             marginLeft: location == 'left' || location == 'right' || location == 'leftMiddle' ? paddingWidth : 0
           }}>
        {this.renderBox(ud, 'bottom')}
        <div className={styles.box}
             style={{
               width: width * 0.055,
               height: height * 0.087,
               backgroundImage: app.statusCode == 1 ? 'url(application/img/icon_bg.png)' : 'url(application/img/icon_bg_error.png)',
             }}>
          <img className={styles.icon_app}
               src={app.statusCode == 1 ? "application/img/icon_app.png" : "application/img/icon_app_error.png"}/>
          <div className={styles.text} style={{
            width: width * 0.069,
            paddingLeft: width * 0.055 * 0.272,
            paddingRight: width * 0.055 * 0.272
          }}>{app.shortName}</div>
        </div>
        {this.renderBox(ud, 'top')}
      </div>
    )
  }
}
