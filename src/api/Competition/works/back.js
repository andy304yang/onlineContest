import request from '@/utils/request'

// 获得协会退回作品
export function getClubReturnWorks(data) {
  return request({
    url: '/api/getReturnWorksMesByClubID',
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
      teacher: data.teacher
    }
  })
}
