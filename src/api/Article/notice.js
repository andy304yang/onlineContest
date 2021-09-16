import request from '@/utils/request'

export function addNotice(temp) {
  return request({
    url: '/api/addNotice',
    method: 'post',
    data: {
      title: temp.title,
      content: temp.content,
      time: temp.time,
      name: temp.name,
      match_name: temp.match_name,
      match_project: temp.match_project,
      short_content: temp.short_content
    }
  })
}

export function deleteNotice(id) {
  return request({
    url: '/api/deleteNotice',
    method: 'post',
    params: {
      id: id
    }
  })
}

export function updataNotice(temp) {
  return request({
    url: '/api/updateNotice',
    method: 'post',
    data: {
      id: temp.id,
      title: temp.title,
      time: temp.time,
      content: temp.content,
      name: temp.name,
      match_name: temp.match_name,
      match_project: temp.match_project,
      short_content: temp.short_content
    }
  })
}

// 检索
export function getNoticeList(data) {
  return request({
    url: '/api/getNoticeMesByString',
    method: 'post',
    params: {
      pageNum: data.page,
      pageSize: data.limit,
      start_date: data.start_date,
      end_date: data.end_date,
      name: data.name,
      match_name: data.match_name,
      match_project: data.match_project,
      title: data.title
    }
  })
}
