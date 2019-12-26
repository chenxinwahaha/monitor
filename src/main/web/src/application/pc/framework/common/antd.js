import React, {Component} from 'react'
import {Button, Icon, Row, Col, Layout, Dropdown, Checkbox,
  DatePicker, Form, Input, InputNumber, Radio, Select, Switch,
  TimePicker, Upload, Popover, Tooltip, Table, Tabs, Tree, Modal,
  notification, Popconfirm, Spin
} from 'antd'

export default class Antd extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render(){
    return (
      <Layout>
        <Modal visible={true}>
          <Form>
            <Input />
            <Button onClick={()=>notification.success({message: 'success'})}>按钮</Button>
            <Icon type="delete"/>
            <Spin>
              <Table columns={[]} dataSource={[]}/>
            </Spin>
            <Row>
              <Col span={24}>1</Col>
            </Row>
            <DatePicker/>
            <Dropdown/>
            <Checkbox/>
            <Tree/>
            <InputNumber/>
            <Radio/>
            <Select>
              <Select.Option value={"1"}>1</Select.Option>
            </Select>
            <Switch/>
            <TimePicker/>
            <Upload/>
            <Popover/>
            <Popconfirm/>
            <Tooltip>11</Tooltip>
            <Tabs>
              <Tab.Pane>111</Tab.Pane>
            </Tabs>
          </Form>
        </Modal>
      </Layout>
    )
  }
}
