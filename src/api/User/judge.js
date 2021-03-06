import request from '@/utils/request'

export function tonobeJudge(tid) {
  return request({
    url: '/api/tonotbeJudge',
    method: 'post',
    params: {
      tid: tid
    }
  })
}

// 检索
export function getJudges(data) {
  return request({
    // url: '/api/getTeacherJudgeMes',
    url: '/api/getCourseJudgeMesByString',
    method: 'post',
    params: {
      realname: data.realname,
      school: data.school,
      major: data.major,
      mid: data.mid,
      pageNum: data.page,
      pageSize: data.limit
    }
  })
}

export function getCourseId(data) {
  return request({
    url: '/api/getCourseMatchMes',
    method: 'post',
    params: {

    }
  })
}

// 添加课程评委
export function AddjudgeCourse(data) {
  return request({
    url: '/api/addCourseJudgeMes',
    method: 'post',
    params: {
      realname: data.realname,
      username: data.username,
      password: data.password,
      school: data.school,
      major: data.major,
      email: data.email,
      phone: data.phone,
      mid: data.mid
    }
  })
}

// 删除评委
export function delCoursejudge(cj_id, mid) {
  return request({
    url: '/api/deleteCourseJudgeMes',
    method: 'post',
    params: {
      cj_id: cj_id,
      mid: mid
    }
  })
}

// 更新评委
export function upjudgeCourse(data) {
  return request({
    url: '/api/updateCourseJudgeMes',
    method: 'post',
    params: {
      realname: data.realname,
      username: data.username,
      password: data.password,
      school: data.school,
      major: data.major,
      email: data.email,
      phone: data.phone,
      mid: data.mid,
      cj_id: data.cj_id
    }
  })
}
