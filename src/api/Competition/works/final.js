import request from '@/utils/request'

// 获得奖项信息
export function getPrizeName(wid) {
  return request({
    url: '/api/getPrizeNameWithID',
    method: 'post',
    params: {
      wid: wid
    }
  })
}

export function advance(list) {
  return request({
    url: '/api/toJSWorks',
    method: 'post',
    params: {
      wid: list.wid,
      certificate: list.tempRadio[1],
      reward_date: list.time
    }
  })
}
