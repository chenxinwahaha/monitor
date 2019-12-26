export const sysMenus = [
  {name: '用户管理', id: 'permissions', icon: 'user', type: 'Short'},
  {name: '黑名单', id: '', icon: 'blackList', type: 'Short'},
  {name: '节点管理', id: 'node', icon: 'nodes', type: 'Short'},
  {name: '应用管理', id: 'app', icon: 'app', type: 'Short'},
  {name: '数据源管理', id: 'dataSource', icon: 'dataBase', type: 'Long'},
  {name: '接口工具', id: 'interface', icon: 'tool', type: 'Short'},
  {name: '集成流模板', id: 'stream', icon: 'interface', type: 'Short'},
  {name: '插件管理', id: 'plugin', icon: 'plugin', type: 'Short'},
  // {name: '接口文档模板', id: '', icon: 'interface', type: 'Long'},
  // {name: '字典匹配', id: '', icon: 'dict', type: 'Long'},
  {name: 'ElasticSearch', id: 'elasticSearch', icon: 'elasticsearch', type: 'Short'}

]

export const menuColors = ['#06afef', '#8ec01d', '#fe9834', '#5a38b6', '#dc572e', '#7719aa', '#008e01', '#0670c3', '#a91f47', '#1AA99D']

export const menus = [
  {name: '设计', icon: 'design', id: 'design', able: false},
  {name: '监控', icon: 'monitor', id: 'monitor', able: false},
  {name: '排错', icon: 'debug', id: 'debug', able: false},
  {name: '系统', icon: 'system', id: 'system', able: false}
]

export const roles = [{name: '管理员用户', id: '1'}, {name: '业务系统用户', id: '2'}]
