import request from '@/utils/request'

export function getReadyWorks(list) {
  return request({
    url: '/api/getReadyWorksByMid',
    method: 'post',
    params: {
      pageNum: list.page,
      pageSize: list.limit
    }
  })
}

export function advance(list) {
  return request({
    url: '/api/toJSWorks',
    method: 'post',
    params: {
      wid: list.wid,
      certificate: list.tempRadio,
      reward_date: list.time
    }
  })
}

// 获得奖项信息
export function getPrizeName() {
  return request({
    url: '/api/getPrizeNameWithID',
    method: 'post',
    params: {

    }
  })
}
