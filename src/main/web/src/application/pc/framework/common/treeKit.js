export function buildTree(dataSource, idField, parentField, rootId, inherit) {
  let elementList = []
  let inheritType = ''
  let defaultExpandedKeys = []
  let allExpandedKeys= []
  let defaultSelectedRecord = {}
  let i = 0
  dataSource.map((item) => {
    let node = Object.assign({}, item)
    if (node[parentField] === rootId) {
      inheritType = node.rootType
      let children = findChildren(node[idField])
      if (children.length > 0) {
        allExpandedKeys.push(node.id)
        node.children = children
        i === 0 ? defaultSelectedRecord = children[0] : void(0)
      }
      elementList.push(node)
      i++
    }
  })

  function findChildren(parent_id) {
    let children = []
    dataSource.map(item => {
      let node = Object.assign({}, item)
      inherit ? node.rootType = inheritType : void(0)
      if (node[parentField] === parent_id) {
        let elementChildren = findChildren(node[idField])
        if (elementChildren.length > 0) {
          node.children = elementChildren
          allExpandedKeys.push(node.id)
        }
        children.push(node)
      }
    })
    return children
  }

  if (elementList.length > 0) {
    defaultExpandedKeys.push(elementList[0][idField])
  }
  return {dataSource: elementList, defaultExpandedKeys, defaultSelectedRecord, allExpandedKeys}
}


export function buildAntdTree(dataSource, idField, titleField, parentField, rootId) {
  let elementList = []
  dataSource.map(node => {
    if (node[parentField] === rootId) {
      let children = findChildren(node[idField])
      let treeNode = {title: node[titleField], key: node[idField]}
      children.length > 0 ? treeNode.children = children : void(0)
      elementList.push(treeNode)
    }
  })

  function findChildren(parent_id) {
    let children = []
    dataSource.map(node => {
      let treeNode = {title: node[titleField], key: node[idField]}
      if (node[parentField] === parent_id) {
        let elementChildren = findChildren(node[idField])
        if (elementChildren.length > 0) {
          treeNode.children = elementChildren
        }
        children.push(treeNode)
      }
    })
    return children
  }

  let defaultExpandedKeys = []
  if (elementList.length > 0) {
    defaultExpandedKeys.push(elementList[0][idField])
  }
  return {dataSource: elementList, defaultExpandedKeys}
}

export function buildNodeTree(dataSource, idField, parentField, rootId) {
  let elementList = []
  dataSource.map(one => {
    if (one[parentField] === rootId) {
      let node = findChildren(one[idField])
      node.length > 0 ? one.node = node : void(0)
      elementList.push(one)
    }
  })

  function findChildren(parent_id) {
    let node = []
    dataSource.map(one => {
      if (one[parentField] === parent_id) {
        let elementChildren = findChildren(one[idField])
        if (elementChildren.length > 0) {
          one.node = elementChildren
        }
        node.push(one)
      }
    })
    return node
  }

  return {oneNodeTree: elementList}
}


const treeData = [{
  title: '0-0',
  key: '0-0',
  children: [{
    title: '0-0-0',
    key: '0-0-0',
    children: [
      {title: '0-0-0-0', key: '0-0-0-0'},
      {title: '0-0-0-1', key: '0-0-0-1'},
      {title: '0-0-0-2', key: '0-0-0-2'},
    ],
  }, {
    title: '0-0-1',
    key: '0-0-1',
    children: [
      {title: '0-0-1-0', key: '0-0-1-0'},
      {title: '0-0-1-1', key: '0-0-1-1'},
      {title: '0-0-1-2', key: '0-0-1-2'},
    ],
  }, {
    title: '0-0-2',
    key: '0-0-2',
  }],
}, {
  title: '0-1',
  key: '0-1',
  children: [
    {title: '0-1-0-0', key: '0-1-0-0'},
    {title: '0-1-0-1', key: '0-1-0-1'},
    {title: '0-1-0-2', key: '0-1-0-2'},
  ],
}, {
  title: '0-2',
  key: '0-2',
}];


