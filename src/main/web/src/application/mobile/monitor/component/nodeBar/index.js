/**
 * Created by 陈鑫 on 2018/4/12.
 */
import React, {Component} from 'react'
import styles from './index.less'

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
  }

  render() {
    const {percentage, a, name} = this.props
    let per = parseInt(percentage) + '%'
    return (
      <div className={styles.body}>
        <div className={styles.name}><span>{name}</span><span>{percentage}%</span></div>
        <li style={{listStyleType: 'disc', color: a}}/>
      </div>
    )
  }
}
