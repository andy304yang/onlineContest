import request from '@/utils/request'
// 获取所有轮播图
export function getlbPhotoMes() {
  return request({
    url: '/api/getlbPhotoMes',
    method: 'post'
  })
}

// 添加轮播图
export function addPhotoMes(data) {
  return request({
    url: '/api/addPhotoMes',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: data
  })
}
// 删除轮播图
export function deletePhotoMes(id) {
  return request({
    url: '/api/deletePhotoMes',
    method: 'post',
    params: {
      id: id
    }
  })
}

// 更新轮播图
export function updatePhotoMes(data) {
  return request({
    url: '/api/updatePhotoMes',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: data
  })
}

// 搜索
export function phosearch(data) {
  return request({
    url: '/api/getlbPhotoMesByid',
    method: 'post',
    params: {
      id: data.id
    }
  })
}
