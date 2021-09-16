import request from '@/utils/request'

// 确定出赛名单接口

export function getHCXWorksbyMatch(list) {
  return request({
    url: '/api/getHCXWorksbyMatch',
    method: 'post',
    params: {
      pageNum: list.page,
      pageSize: list.limit
    }
  })
}

export function toTuihuiCXworks(mid) {
  return request({
    url: '/api/toTuihuiCXworks',
    method: 'post',
    data: {
      mid: mid
    }
  })
}

export function toOutgoing(mid) {
  return request({
    url: '/api/toChuXian',
    method: 'post',
    data: {
      mid: mid
    }
  })
}
