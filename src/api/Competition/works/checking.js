import request from '@/utils/request'

// 获得协会待审核作品
export function getClubWorks(data) {
  return request({
    url: '/api/getWorksAMesByClubID',
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

// 审核作品
export function review(data) {
  return request({
    url: '/api/toShenHe',
    method: 'post',
    params: {
      widList: data.wid.toString()
    }
  })
}

// 退回作品
export function notpassed(data) {
  return request({
    url: '/api/toTuiHui',
    method: 'post',
    params: {
      widList: data.wid.toString(),
      subject: data.theme,
      content: data.content
    }
  })
}

// 已筛选作品
export function getFilteredWorksMes(list) {
  return request({
    url: '/api/getWorksMesB',
    method: 'post',
    params: {
      pageNum: list.page,
      pageSize: list.limit
    }
  })
}

