import request from '@/utils/request'

export function getPrizeModelMes() {
  return request({
    url: '/api/getPrizeModelMes',
    method: 'post'
  })
}

export function addPrizeModel(data) {
  return request({
    url: '/api/addPrizeModel',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: data
  })
}

export function updatePrizeModel(data) {
  return request({
    url: '/api/updatePrizeModel',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: data
  })
}

export function deletePrizeModel(pid) {
  return request({
    url: '/api/deletePrizeModel',
    method: 'post',
    params: {
      pid: pid
    }
  })
}

// 获得奖项名字
export function getPriceName() {
  return request({
    url: '/api/getPrizeNameWithID',
    method: 'post'
  })
}
// 课程管理员接口
// 获取奖状列表
export function getCoursePrizeMes() {
  return request({
    url: '/api/getCoursePrizeMes',
    method: 'post'
  })
}
// 添加奖状
export function addCoursePrize(data) {
  return request({
    url: '/api/addCoursePrize',
    method: 'post',
    params: {
      prize_name: data.prize_name,
      pm_id: data.pm_id,
      mid: data.mid
    }
  })
}
// 获取赛事id
export function getCourseMatchMesByCid() {
  return request({
    url: '/api/getCourseMatchMesByCid',
    method: 'post'
  })
}
// 获取模板id
export function getModelNameWithID() {
  return request({
    url: '/api/getModelNameWithID',
    method: 'post'
  })
}
// 删除奖状
export function deleteCoursePrize(pr_id) {
  return request({
    url: '/api/deleteCoursePrize',
    method: 'post',
    params: {
      pr_id: pr_id
    }
  })
}
// 更新课程管理员奖状
export function updateCoursePrize(data) {
  return request({
    url: '/api/updateCoursePrize',
    method: 'post',
    params: {
      prize_name: data.prize_name,
      pm_id: data.pm_id,
      mid: data.mid,
      pr_id: data.pr_id
    }
  })
}
