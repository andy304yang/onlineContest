import request from '@/utils/request'

// 获得作品
export function getWorks(data) {
  return request({
    url: '/api/getWorksMesByString',
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
      pageSize: data.limit,
      PWteacher: null,
      normalization: data.normalization
    }
  })
}

// 获得协会管理员的作品
export function getClubWorks(data) {
  return request({
    url: '/api/getWorksMesByClubID',
    method: 'post',
    params: {
      pageNum: data.page,
      pageSize: data.limit,
      match_name: data.match_name,
      match_project: data.match_project,
      work_name: data.work_name,
      type: data.type,
      teamname: data.teamname,
      author1_name: data.author1_name,
      teacher: data.teacher,
      PWteacher: null,
      normalization: data.normalization
    }
  })
}
