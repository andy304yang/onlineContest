import request from '@/utils/request'

export function getSortCompetitions(data) {
  return request({
    url: '/api/getMatchMesByString_Sort',
    method: 'post',
    params: {
      pageNum: data.page,
      pageSize: data.limit
    }
  })
}

export function deleteData(data) {
  return request({
    url: '/api/sortPackageByMid',
    method: 'post',
    params: {
      midList: data.mid.toString()
    }
  })
}
