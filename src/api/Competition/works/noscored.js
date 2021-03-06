import request from '@/utils/request'

export function returnNoscored(data) {
  return request({
    url: '/api/toTuiHuiPF',
    method: 'post',
    params: {
      widList: data.toString()
    }
  })
}
// 退回课程
export function returnCourse(widList) {
  return request({
    url: '/api/toTuiHuiCourseJudge',
    method: 'post',
    params: {
      widList: widList.toString()
    }
  })
}
