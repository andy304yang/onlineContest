import request from '@/utils/request'

export function toDelect(tid) {
  return request({
    url: '/api/deleteTeacherMes',
    method: 'post',
    params: {
      tid: tid
    }
  })
}

export function getClubs() {
  return request({
    url: '/api/getClubMes',
    method: 'post',
    params: {
      pageNum: 1,
      pageSize: 10000
    }
  })
}

export function addTeacherMes(data) {
  return request({
    url: '/api/addTeacherMes',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: {
      username: data.username,
      realname: data.realname,
      password: data.password,
      school: data.school,
      college: data.college,
      email: data.email,
      phone: data.phone,
      code: data.isJudge
    }
  })
}

export function updateTeacherMes(data) {
  return request({
    url: '/api/updateTeacherMes',
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    params: {
      username: data.username,
      realname: data.realname,
      password: data.password,
      school: data.school,
      college: data.college,
      email: data.email,
      phone: data.phone,
      code: data.code,
      tid: data.tid
    }
  })
}

export function getRoles() {
  return request({
    url: '/api/getRoles',
    method: 'post'
  })
}

export function tobeJudge(tid) {
  return request({
    url: '/api/tobeJudge',
    method: 'post',
    params: {
      tid: tid
    }
  })
}

export function tonotbeJudge(tid) {
  return request({
    url: '/api/tonotbeJudge',
    method: 'post',
    params: {
      tid: tid
    }
  })
}

export function tobeAdmin(data) {
  return request({
    url: '/api/setTeacherGRole',
    method: 'post',
    params: {
      tid: data.tid,
      roleId: data.roleId
    }
  })
}

// 检索
export function getTeacher(data) {
  return request({
    url: '/api/getTeacherMesByString',
    method: 'post',
    params: {
      pageNum: data.page,
      pageSize: data.limit,
      realname: data.realname,
      college: data.college,
      school: data.school
    }
  })
}

// 导出excel表格
export function downloadTeacherMes() {
  return request({
    url: '/api/downloadTeacherMes',
    method: 'post'
  })
}
