
const routerMap = [{
  name: 'accountManage',
  button: [],
  children: [{
    name: 'accountEntry',
    button: [{
      key: 'query',
      name: '查询'
    }, {
      key: 'detail',
      name: '详情'
    }, {
      key: 'add',
      name: '新增'
    }, {
      key: 'update', 
      name: '修改'
    }, {
      key: 'delete', 
      name: '删除'
    }],
    children: [],
  }, {
    name: 'merchantsOrder',
    button: [{
      key: 'query',
      name: '查询'
    }, {
      key: 'detail',
      name: '详情'
    }, {
      key: 'add',
      name: '新增'
    }, {
      key: 'update', 
      name: '修改'
    }, {
      key: 'delete', 
      name: '删除'
    }],
    children: [],
  }, {
    name: 'orderDetail',
    button: [{
      key: 'query',
      name: '查询'
    }, {
      key: 'detail',
      name: '详情'
    }, {
      key: 'add',
      name: '新增'
    }, {
      key: 'update', 
      name: '修改'
    }, {
      key: 'delete', 
      name: '删除'
    }],
    children: [],
  }, {
    name: 'reconExcel',
    button: [{
      key: 'query',
      name: '查询'
    }, {
      key: 'detail',
      name: '详情'
    }, {
      key: 'add',
      name: '新增'
    }, {
      key: 'update', 
      name: '修改'
    }, {
      key: 'delete', 
      name: '删除'
    }],
    children: [],
  }, {
    name: 'enterpriseExcel',
    button: [{
      key: 'query',
      name: '查询'
    }, {
      key: 'detail',
      name: '详情'
    }, {
      key: 'add',
      name: '新增'
    }, {
      key: 'update', 
      name: '修改'
    }, {
      key: 'delete', 
      name: '删除'
    }],
    children: [],
  }]
}, {
  name: 'recycleGoods',
  button: [],
  children: [{
    name: 'orderManage',
    button: [{
      key: 'query',
      name: '查询'
    }, {
      key: 'detail',
      name: '详情'
    }, {
      key: 'add',
      name: '新增'
    }, {
      key: 'update', 
      name: '修改'
    }, {
      key: 'delete', 
      name: '删除'
    }],
    children: [],
  }, {
    name: 'orderList',
    button: [{
      key: 'query',
      name: '查询'
    }, {
      key: 'detail',
      name: '详情'
    }, {
      key: 'add',
      name: '新增'
    }, {
      key: 'update', 
      name: '修改'
    }, {
      key: 'delete', 
      name: '删除'
    }],
    children: [],
  }]
}, {
  name: 'Menu1',
  button: [],
  children: [{
    name: 'menu1-1',
    button: [],
    children: []
  }, {
    name: 'menu1-2',
    button: [],
    children: [{
      name: 'menu1-2-1',
      button: [],
      children: []
    }, {
      name: 'menu1-2-2',
      button: [],
      children: [],
    }]
  }]
}]
// const data = [
//   {name: '对账管理', key: 'accountManage', button: []}
// ]

const data = {
  code: 200,
  data: null,
  info: '查询成功'
}

export default {
  routerMap: config => {
    data.data = routerMap
    return data;
  },
}