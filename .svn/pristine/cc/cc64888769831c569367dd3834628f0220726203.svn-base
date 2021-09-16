import request from '@/utils/request'

export function getMarktableMes(list) {
  return request({
    url: '/api/getMarktableMes',
    method: 'post',
    params: {
      pageNum: list.page,
      pageSize: list.limit
    }
  })
}

export function addMarktable(data) {
  return request({
    url: '/api/addMarktable',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: data
  })
}

export function updateMarktable(data) {
  return request({
    url: '/api/updateMarktable',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

export function deleteMarktable(id) {
  return request({
    url: '/api/deleteMarktable',
    method: 'post',
    params: {
      id: id
    }
  })
}

// 获得竞赛名字
export function getMatchID() {
  return request({
    url: '/api/getMatchID',
    method: 'post'
  })
}

// 获取评分表模板文件
export function getTest() {
  return request({
    url: '/markTable/评分表模版.xlsx',
    method: 'get'
  })
}

// 通过ID获取全部评分表信息
export function getMarkTableMesByid(id) {
  return request({
    url: '/api/getMarkTableMesByid',
    method: 'post',
    params: {
      id: id
    }
  })
}

// 搜索
export function search(data) {
  return request({
    url: '/api/getMarkTableMesByid',
    method: 'post',
    params: {
      id: data.id
    }
  })
}
