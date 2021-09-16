import request from '@/utils/request'

// 通过id获取作品详情
export function getWorkDetails(wid) {
  return request({
    url: '/api/getWorksMesByid',
    method: 'post',
    params: {
      wid: wid
    }
  })
}
export function getCourseJudgeScore(wid, score) {
  return request({
    url: '/api/getGradeCourseJudge',
    method: 'post',
    params: {
      wid: wid,
      score: score
    }
  })
}
