import request from '@/utils/request'

export function addDynamic(data) {
  return request({
    url: '/api/addDynamic',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: data
  })
}

export function deleteDynamic(id) {
  return request({
    url: '/api/deleteDynamic',
    method: 'post',
    params: {
      id: id
    }
  })
}

export function updateDynamic(data) {
  return request({
    url: '/api/updateDynamic',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: data
  })
}

// 检索
export function queryDynamicList(data) {
  return request({
    url: '/api/getDynamicMesByString',
    method: 'post',
    params: {
      pageNum: data.page,
      pageSize: data.limit,
      start_date: data.start_date,
      end_date: data.end_date,
      name: data.name,
      match_name: data.match_name,
      match_project: data.match_project,
      title: data.title
    }
  })
}
