import request from '@/utils/request'

// 获取所有未进行出线操作的竞赛
export function toCXForMatch(list) {
  return request({
    url: '/api/toCXForMatch',
    method: 'post',
    params: {
      pageNum: list.page,
      pageSize: list.limit
    }
  })
}

// 获取需要确认的出线名单
export function getCXWorksbyMatch(data) {
  return request({
    url: '/api/getCXWorksbyMatch',
    method: 'post',
    params: {
      mid: data.mid,
      num: data.percentage,
      ranknum: data.ranknum
    }
  })
}

// 提交出线名单
export function toChuXian(widlist, data) {
  return request({
    url: '/api/toChuXian',
    method: 'post',
    params: {
      widlist: widlist.toString(),
      mid: data.mid,
      num: data.percentage,
      totalWorks: data.totalWork
    }
  })
}
