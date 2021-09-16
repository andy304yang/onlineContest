import request from '@/utils/request'

export function getMessageQue() {
  return request({
    // url: '/getDashboard1',
    url: '/api/getHomePageMes',
    method: 'post'
  })
}
