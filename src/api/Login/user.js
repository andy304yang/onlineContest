import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/loginCheck',
    method: 'post',
    params: {
      username: data.username,
      password: data.password,
      isRemember: data.isRemember
    }
  })
}

export function getInfo() {
  return request({
    url: '/api/getGserMesByToken',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/api/loginout',
    method: 'post'
  })
}

