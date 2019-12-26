import {notification, Button, Modal} from 'antd'
import React from 'react'

export default function alert(title, e) {
  if (e.code !== 0) {
    notification.success({
      message: "操作成功",
      description: `${title}成功!`,
      duration: 2
    })
  } else {
    const info = () => {
      Modal.error({
        title: "操作失败",
        content: (
          <pre style={{width: '900px',height:'300px', overflow: 'auto'}}>
            {e.exception}
          </pre>
        ),
        width: 1000,
        okText:"确定",
        onOk() {
          notification.close(key)
        }
      })
    }

    const key = `open${Date.now()}`

    const btnClick = function () {
      info()
    }

    const btn = (
      <Button type="dashed" icon="search" size="small" onClick={btnClick}>
        查看详细
      </Button>
    )

    notification.error({
      message: "操作失败",
      description: e.tips,
      key,
      btn,
      duration: 10
    })
  }
}
