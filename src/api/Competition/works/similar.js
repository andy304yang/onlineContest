import request from '@/utils/request'

export function passSimilar(data) {
  return request({
    url: '/api/ShenHeSimilarWork',
    method: 'post',
    params: {
      widList: data.wid.toString()
    }
  })
}

export function returnSimilar(data) {
  return request({
    url: '/api/TuiHuiSimilarWork',
    method: 'post',
    params: {
      widList: data.wid.toString(),
      subject: data.theme,
      content: data.content
    }
  })
}

export function getSimilarWorksMesByWid(id) {
  return request({
    url: '/api/getSimilarWorksMesByWid',
    method: 'post',
    params: {
      wid: id
    }
  })
}
