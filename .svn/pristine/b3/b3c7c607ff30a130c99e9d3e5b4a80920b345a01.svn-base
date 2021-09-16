import request from '@/utils/request'
// 搜索全部作品
export function Searchbouns(data) {
  return request({
    url: '/api/getWorksNoRewardMesByString',
    method: 'post',
    params: {
      match_name: data.match_name,
      match_project: data.match_project,
      work_name: data.work_name,
      type: data.type,
      teamname: data.teamname,
      author1_name: data.author1_name,
      teacher: data.teacher,
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      prize_name: data.prize_name
    }
  })
}

export function getAllWorks(data) {
  return request({
    url: '/api/getAllWorksMes',
    method: 'post',
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize
    }
  })
}

// 导出excel表格
export function downloadAllWorksMes() {
  return request({
    url: '/api/downloadAllWorksMes',
    method: 'post'
  })
}
