import request from '@/utils/request'

export function getClubMes(list) {
  return request({
    url: '/api/getClubMes',
    method: 'post',
    params: {
      pageNum: list.page,
      pageSize: list.limit
    }
  })
}

export function addClubMes(list) {
  return request({
    url: '/api/addClubMes',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: {
      pageNum: list.page,
      pageSize: list.limit,
      clubname: list.clubname,
      leader: list.leader,
      phone: list.phone,
      email: list.email,
      date: list.date,
      content: list.content,
      college: list.college
    }
  })
}

export function updateClubMes(list) {
  return request({
    url: '/api/updateClubMes',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: {
      pageNum: list.page,
      pageSize: list.limit,
      cid: list.cid,
      clubname: list.clubname,
      leader: list.leader,
      phone: list.phone,
      email: list.email,
      date: list.date,
      content: list.content,
      college: list.college
    }
  })
}

export function deleteClub(cid) {
  return request({
    url: '/api/deleteClub',
    method: 'post',
    params: {
      cid: cid
    }
  })
}
