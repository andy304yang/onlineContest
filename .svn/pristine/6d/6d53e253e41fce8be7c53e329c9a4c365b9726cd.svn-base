import request from '@/utils/request'

export function getFinishMatch(list) {
  return request({
    url: '/api/getHCXWorksbyMatch',
    method: 'post',
    params: {
      pageNum: list.page,
      pageSize: list.limit
    }
  })
}

export function getWorksDetail(data) {
  return request({
    url: '/api/getCXWorksByMid',
    method: 'post',
    params: {
      cid: '',
      mid: data.mid,
      pageNum: data.page,
      pageSize: data.limit
    }
  })
}

export function Audit(wid) {
  return request({
    url: '/api/toShenHeCXWorks',
    method: 'post',
    params: {
      wid: wid
    }
  })
}

export function Return(mid) {
  return request({
    url: '/api/toTuihuiCXworks',
    method: 'post',
    params: {
      mid: mid
    }
  })
}
