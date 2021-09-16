import request from '@/utils/request'

export function getQuestionList(list) {
  return request({
    url: '/api/queryQuestionsList',
    method: 'post',
    params: {
      pageNum: list.page,
      pageSize: list.limit
    }
  })
}

export function addQuestion(temp) {
  return request({
    url: '/api/addQuestions',
    method: 'post',
    params: {
      content: temp.qcontent,
      answer: temp.answer
    }
  })
}

export function deleteQuestion(id) {
  return request({
    url: '/api/deleteQuestions',
    method: 'post',
    params: {
      id: id
    }
  })
}

export function updateQuestion(temp) {
  return request({
    url: '/api/updateQuestions',
    method: 'post',
    params: {
      id: temp.qid,
      content: temp.qcontent,
      answer: temp.answer
    }
  })
}

// 搜索
export function search(data) {
  return request({
    url: '/api/queryQuestionByString',
    method: 'post',
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      qcontent: data.qcontent
    }
  })
}
