/**
 * Created by cxing on 2018/10/17.
 */
import React, {Component} from 'react'
import styles from './radar.less'
import NodeBar from '../nodeBar/index'
import {Tabs, Button, Menu, Dropdown, Icon} from 'antd';
import {Carousel, WingBlank} from 'antd-mobile';

export default class Radar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      success: 0,
      error: 0,
      warning: 0,
      blips: "",
      code: true,
      showCode: true,
      colorCode: false
    }
  }

  componentWillMount() {
    let success = 0;
    let error = 0;
    let warning = 0;
    let blips
    let showCode = true
    let colorCode = false
    const {monitorList} = this.props
    if (monitorList && monitorList.length) {
      monitorList.map((item, index) => {
        if (item) {
          let blip
          switch (item.state) {
            case 0:
              error = error + 1;
              blip = "radial-gradient(" + this.getRandomNum(1, 3) + "vmin circle at " + this.getRandomNum(20, 80) + "% " + this.getRandomNum(20, 80) + "%, #ffffff 10%, rgb(244, 40, 80) 30%, rgba(255, 255, 255, 0) 100%)"
              showCode ? showCode = false : void 0
              colorCode = true
              break;
            case 1:
              success = success + 1;
              blip = "radial-gradient(" + this.getRandomNum(1, 3) + "vmin circle at " + this.getRandomNum(20, 80) + "% " + this.getRandomNum(20, 80) + "%, #ffffff 10%, #00FFFF 30%, rgba(255, 255, 255, 0) 100%)"
              break;
            case 2:
              warning = warning + 1;
              blip = "radial-gradient(" + this.getRandomNum(1, 3) + "vmin circle at " + this.getRandomNum(20, 80) + "% " + this.getRandomNum(20, 80) + "%, #ffffff 10%, #ff9966 30%, rgba(255, 255, 255, 0) 100%)"
              showCode ? showCode = false : void 0
              break;
            default:
              break;
          }
          switch (index) {
            case 0:
              blips = blip;
              break;
            default:
              blips = blips + "," + blip;
              break;
          }
        }
      })
      this.setState({
        success: parseInt(success * 100 / monitorList.length),
        error: parseInt(error * 100 / monitorList.length),
        warning: parseInt(warning * 100 / monitorList.length),
        blips: blips,
        showCode: showCode,
        colorCode: colorCode
      })
    }
  }

  getRandomNum(Min, Max) {
    let Range = Max - Min;
    let Rand = Math.random();
    return (Min + Math.round(Rand * Range));
  }

  renderMessage() {
    const {success, error, warning} = this.state
    return <div className={styles.content}>
      <NodeBar percentage={success} a="#0085E8" name="正常"/>
      <NodeBar percentage={error} a="rgb(244, 40, 80)" name="异常"/>
      <NodeBar percentage={warning} a="rgb(246, 169, 59)" name="告警"/>
    </div>
  }

  clickTitle(code) {
    this.setState({
      code: code
    })
  }

  renderDetails(monitorList) {
    return monitorList.map((item, index) => {
      let state
      switch (item.state) {
        case 0:
          state = "异常"
          return <div className={styles.message}>
            <span style={{
              color: "white",
              opacity: '0.9',
              textAlign: "right",
              width: "50%",
              marginRight: "2rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>{item.name}</span>
            <li style={{listStyleType: 'disc', color: "rgb(244, 40, 80)"}}/>
            <span style={{color: "rgb(244, 40, 80)", textAlign: "left", width: "50%"}}>{item.reason}</span></div>
          break;
        case 2:
          state = "告警"
          return <div className={styles.message}>
            <span style={{
              color: "white",
              opacity: '0.9',
              textAlign: "right",
              width: "50%",
              marginRight: "2rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>{item.name}</span>
            <li style={{listStyleType: 'disc', color: "orange"}}/>
            <span style={{color: "orange", textAlign: "left", width: "50%"}}>{item.reason}</span>
          </div>
          break;
        default:
          break;
      }
    })
  }

  renderItems(monitorList, code) {
    let filterList = []
    if (monitorList) {
      monitorList.map(e => {
        if (e && e.state !== 1) {
          filterList.push(e)
        }
      })
      return filterList.map((item) => {
        if (item && item.state !== 1) {
          return <div className="v-item"
                      style={{color: item.state === 0 ? "rgb(244, 40, 80)" : "rgb(246, 169, 59)"}}
                      onClick={() => this.clickTitle(code ? false : true)}>{item.name}{item.reason}</div>
        }
      })
    }
  }

  render() {
    const {showCode, blips, code, colorCode} = this.state
    const {monitorList} = this.props
    return (
      <div className={styles.box} style={{background: 'url(application/mobile/radar/bg1.png) transparent -49rem 0rem'}}>
        <div className={styles.body}>
          <div className="radar"
               id="myRadar"
               style={{backgroundImage: 'url(application/mobile/radar/radar4.png)'}}>
            <div className="radarBefore">
            </div>
            <div className="radarAfter"></div>
          </div>
          {this.renderMessage(monitorList)}
        </div>
        <div className={styles.bottom}>
          <div style={{background: 'rgba(0,0,0,.1)', width: '100%', height: '100%'}}>
            {monitorList && monitorList.length ? (showCode ? <div className={styles.title}>
              <div style={{color: "white", opacity: '0.9'}}>所有组件运行正常</div>
              <Icon type="down" theme="outlined" style={{color: "white"}}/>
            </div> : <div className={styles.title} onClick={() => this.clickTitle(code ? false : true)}>
              <div style={{color: "white", opacity: '0.9'}}>组件异常</div>
              <div className={styles.myCarousel}>
                {monitorList && monitorList.length ? <WingBlank>
                  <Carousel className="my-carousel"
                            vertical
                            dots={false}
                            dragging={false}
                            swiping={false}
                            autoplay
                            infinite
                  >
                    {this.renderItems(monitorList, code)}
                  </Carousel>
                </WingBlank> : void 0}</div>
              <Icon type={code ? "down" : "up"} theme="outlined" style={{color: "white"}}/>
            </div>) : void (0)}
            {code ? void 0 :
              <div className={styles.content}>
                <div>
                  {monitorList && monitorList.length ? this.renderDetails(monitorList) : void 0}
                </div>
              </div>}
          </div>

        </div>
        <style>
          {`
  .radar {
    width: 45rem;
    height: 45rem;
    position: relative;
    left: 35%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    overflow: hidden;
    background: no-repeat;
    background-size: 100% 100%;
  }
  .radarBefore {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background:` + blips + `;
    animation: points 3s infinite linear;
    -moz-animation: points 3s infinite linear;
    -webkit-animation: points 3s infinite linear;
    -o-animation: points 3s infinite linear;
  }
  .radarAfter {
    content: ' ';
    display: block;
    background-image: linear-gradient(44deg,rgba(0, 191, 255, 0) 45%, #00BFFF 100%);
    width: 44%;
    height: 44%;
    position: absolute;
    top: 6%;
    left: 6%;
    animation-play-state:running;
    -webkit-animation-play-state:state:running;
    animation: radarBeam 5s infinite linear;
    -webkit-animation: radarBeam 5s infinite linear;
    -moz-animation: radarBeam 5s infinite linear;
    -o-animation: radarBeam 5s infinite linear;
    transform-origin: bottom right;
    border-radius: 100% 0 0 0;
  }
    @keyframes points {
    0% {
      background: ` + blips + `;
      opacity: 1;
    }
    26% {
      background:` + blips + ` ;
      opacity: 0.5;
    }
    100% {
      background: ` + blips + `;
      opacity: 1;
    }
  }
  @-webkit-keyframes points {
    0% {
      background: ` + blips + `;
      opacity: 1;
    }
    26% {
      background:` + blips + ` ;
      opacity: 0.5;
    }
    100% {
      background: ` + blips + `;
      opacity: 1;
    }
  }
  @keyframes radarBeam {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @-moz-keyframes radarBeam {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes radarBeam {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes radarBeam {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }`}
        </style>
      </div>
    )
  }
}
