import request from '@/utils/request'

export function getSortWorks(data) {
  return request({
    url: '/api/getSortWorks',
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
      year: data.year
    }
  })
}
