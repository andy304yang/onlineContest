import request from '@/utils/request'

export function getClubUndistributed(data) {
  return request({
    url: '/api/getWorksBMesByClubID',
    method: 'post',
    params: {
      match_name: data.match_name,
      match_project: data.match_project,
      work_name: data.work_name,
      type: data.type,
      teamname: data.teamname,
      author1_name: data.author1_name,
      teacher: data.teacher,
      pageNum: data.page,
      pageSize: data.limit
    }
  })
}

export function toDistributed(workId, checkedJudges, time) {
  return request({
    url: '/api/ToFenPei',
    method: 'post',
    params: {
      widList: workId.toString(),
      teacherList: checkedJudges.toString(),
      sid: 0,
      lastTime: time
    }
  })
}

export function undistrSearch(data) {
  return request({
    url: '/api/getWorksMesBByString',
    method: 'post',
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      match_name: data.match_name,
      match_project: data.match_project,
      work_name: data.work_name,
      type: data.type,
      teamname: data.teamname,
      author1_name: data.author1_name,
      teacher: data.teacher,
      start_date: data.start_date,
      end_date: data.end_date
    }
  })
}

// 检索
export function getJudges(data) {
  return request({
    url: '/api/getTeacherJudgeMes',
    // url: '/api/getCourseJudgeMesByString',
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
