// 生成数据列表
var dataList = [
  {
    'deptId': 1,
    'parentId': 0,
    'name': '少年之星北京总部',
    'parentName': null,
    'orderNum': 0,
    'delFlag': 0,
    'open': null,
    'list': null
  },
  {
    'deptId': 2,
    'parentId': 1,
    'name': '北京户外星球',
    'parentName': '少年之星北京总部',
    'orderNum': 1,
    'delFlag': 0,
    'open': null,
    'list': null
  },
  {
    'deptId': 3,
    'parentId': 1,
    'name': '北京美吉姆',
    'parentName': '少年之星北京总部',
    'orderNum': 2,
    'delFlag': 0,
    'open': null,
    'list': null
  },
  {
    'deptId': 4,
    'parentId': 3,
    'name': '北京美吉姆朝阳店',
    'parentName': '北京美吉姆',
    'orderNum': 0,
    'delFlag': 0,
    'open': null,
    'list': null
  },
  {
    'deptId': 5,
    'parentId': 3,
    'name': '北京美吉姆海淀店',
    'parentName': '北京美吉姆',
    'orderNum': 1,
    'delFlag': 0,
    'open': null,
    'list': null
  }
]

// 获取部门列表
export function list () {
  return {
    isOpen: true,
    url: '/sys/dept/list',
    type: 'get',
    data: {
      'msg': 'success',
      'code': '0',
      'resp': {
        'list': dataList
      }
    }
  }
}

// 获取指定用户的部门
export function select () {
  return {
    isOpen: true,
    url: '/sys/dept/select',
    type: 'get',
    data: {
      'msg': 'success',
      'code': '0',
      'resp': {
        'dataList': dataList
      }
    }
  }
}

// 获取部门信息
export function info () {
  return {
    isOpen: true,
    url: '/sys/dept/info',
    type: 'get',
    data: {
      'msg': 'success',
      'code': '0',
      'resp': {
        'dept': dataList[0]
      }
    }
  }
}

// 添加部门
export function add () {
  return {
    isOpen: true,
    url: '/sys/dept/save',
    type: 'post',
    data: {
      'msg': 'success',
      'code': '0'
    }
  }
}

// 修改部门
export function update () {
  return {
    isOpen: true,
    url: '/sys/dept/update',
    type: 'post',
    data: {
      'msg': 'success',
      'code': '0'
    }
  }
}

// 删除部门
export function del () {
  return {
    isOpen: true,
    url: '/sys/dept/delete',
    type: 'post',
    data: {
      'msg': 'success',
      'code': '0'
    }
  }
}
