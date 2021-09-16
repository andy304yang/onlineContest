import request from '@/utils/request'
// 获取所有轮播视频
export function getlbVedioMes() {
  return request({
    url: '/api/getlbVedioMes',
    method: 'post'
  })
}

// 添加轮播视频
export function addVedioMes(data) {
  return request({
    url: '/api/addVedioMes',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: data
  })
}
// 删除轮播视频
export function deleteVedioMes(id) {
  return request({
    url: '/api/deleteVedioMes',
    method: 'post',
    params: {
      id: id
    }
  })
}

// 更新轮播视频
export function updateVedioMes(data) {
  return request({
    url: '/api/updateVedioMes',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

// 搜索
export function mvsearch(data) {
  return request({
    url: '/api/getlbVedioMesByid',
    method: 'post',
    params: {
      id: data.id
    }
  })
}
