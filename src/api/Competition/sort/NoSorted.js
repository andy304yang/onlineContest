import request from '@/utils/request'

// 获取下线且未归档的列表
export function getNoSortCompetitions(data) {
  return request({
    url: '/api/getMatchMesByString_NOSort',
    method: 'post',
    params: {
      pageNum: data.page,
      pageSize: data.limit
    }
  })
}

// 统一归档
export function sortCompetitions(data) {
  return request({
    url: '/api/sortPackageByMid',
    method: 'post',
    params: {
      mid: data.mid.toString()
    }
  })
}

// 上线竞赛
export function ShowMatch(data) {
  return request({
    url: '/api/isShowMatchMes',
    method: 'post',
    params: {
      mid: data.mid,
      onTime: 1
    }
  })
}
