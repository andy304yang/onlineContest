import request from '@/utils/request'

export function getAboutList() {
  return request({
    url: '/api/queryAboutUsList',
    method: 'post'
  })
}

export function addAboutUs(temp) {
  return request({
    url: '/api/addAboutUs',
    method: 'post',
    data: {
      content: temp.content,
      author: temp.author,
      content_short: temp.content_short,
      time: temp.time
    }
  })
}

export function deleteAbout(id) {
  return request({
    url: '/api/deleteAboutUs',
    method: 'post',
    params: {
      id: id
    }
  })
}
