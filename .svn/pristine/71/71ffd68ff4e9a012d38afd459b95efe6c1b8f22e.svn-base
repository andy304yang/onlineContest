import request from '@/utils/request'

// export function getCompetitors(list) {
//   return request({
//     url: '/api/getUserMes',
//     method: 'post',
//     params: {
//       pageNum: list.page,
//       pageSize: list.limit
//     }
//   })
// }

export function addCompetitors(temp) {
  return request({
    url: '/api/addQuestions',
    method: 'post',
    params: {
      content: temp.qcontent,
      answer: temp.answer
    }
  })
}

export function deleteCompetitors(id) {
  return request({
    url: '/api/delUserMesbyid',
    method: 'post',
    params: {
      uid: id
    }
  })
}

export function updateCompetitors(temp) {
  console.log('temp:' + temp)
  return request({
    url: '/api/updateUserMes',
    method: 'post',
    params: {
      uid: temp.uid,
      password: temp.password,
      number: temp.number,
      username: temp.username,
      school: temp.school,
      college: temp.college,
      major: temp.major,
      email: temp.email,
      phone: temp.phone,
      register_date: temp.register_date,
      match_id: temp.match_id
    }
  })
}

// 检索
export function getCompetitors(data) {
  return request({
    url: '/api/getUserMesByString',
    method: 'post',
    params: {
      pageNum: data.page,
      pageSize: data.limit,
      username: data.username,
      school: data.school,
      college: data.college,
      major: data.major
    }
  })
}

// 获取选手详细信息
export function getUserMesByid(id) {
  return request({
    url: '/api/getUserMesByid',
    method: 'post',
    params: {
      uid: id
    }
  })
}

// 获得选手管理Excel接口
export function getUserListExcel() {
  return request({
    url: '/api/getUserList',
    method: 'post'
  })
}
