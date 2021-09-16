// 课程管理员特有的api
import request from '@/utils/request'

// 获得课程管理员的作品
export function getCourseWorks(data) {
  return request({
    url: '/api/getAllWorksByCourseID',
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

// 获取未进行出线操作的课程赛
export function getCourseUnriseWorks(data) {
  return request({
    url: '/api/getNotCXcourseMatchMes',
    method: 'post',
    params: {
      pageNum: data.page,
      pageSize: data.limit
    }
  })
}

// 获取已经进行出线操作的课程赛
export function getCourseRiseWorks(data) {
  return request({
    url: '/api/getCXcourseMatchMes',
    method: 'post',
    params: {
      pageNum: data.page,
      pageSize: data.limit
    }
  })
}

// 获取课程状态判断
export function getCourseWorkMes(data) {
  return request({
    url: '/api/getWorksMesByCourseID',
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
      teacher: data.teacher,
      normalization: data.normalization
    }
  })
}

// 审核作品
export function reviewCourse(data) {
  return request({
    url: '/api/toShenHeCourse',
    method: 'post',
    params: {
      widlist: data.wid.toString()
    }
  })
}

// 检索评委
export function getJudgesCourse(data) {
  return request({
    url: '/api/getCourseJudgeMesByCid',
    method: 'post',
    params: {
      cid: data.cid
    }
  })
}

// 分配评委
export function toDistributedCourse(workId, checkedJudges, time) {
  return request({
    url: '/api/toFenPeiCourseJudge',
    method: 'post',
    params: {
      widList: workId.toString(),
      sid: 0,
      courseJudgeList: checkedJudges.toString(),
      lastTime: time
    }
  })
}

// 制作出现名单
export function getCourseCXWorksbyMatch(data) {
  return request({
    url: '/api/getCXcourseWorksMes',
    method: 'post',
    params: {
      mid: data.mid,
      num: data.percentage,
      ranknum: data.ranknum
    }
  })
}

// 提交出现名单
export function CoursetoChuXian(widlist, data) {
  return request({
    url: '/api/gotoCourseWorks',
    method: 'post',
    params: {
      widlist: widlist.toString(),
      mid: data.mid,
      num: data.percentage,
      totalWorks: data.totalWork
    }
  })
}

// 获得奖项名字
export function getPriceNameByCounrseId() {
  return request({
    url: '/api/getPrizeNameByCounrseID',
    method: 'post'
  })
}

// 提交修改奖项
export function advanceCourse(list) {
  return request({
    url: '/api/updateCourseCertificate',
    method: 'post',
    params: {
      wid: list.wid,
      certificate: list.tempRadio[1],
      reward_date: list.reward_date
    }
  })
}

// 下载作品资源
export function downLoadAllCourseWork() {
  return request({
    url: '/api/downLoadAllCourseWork',
    method: 'post'
  })
}

// 下载已得分作品志愿
export function downloadCourseWorksScore() {
  return request({
    url: '/api/downloadCourseWorksScore',
    method: 'post'
  })
}

// 课程管理员退回作品
export function CourseReturn(mid) {
  return request({
    url: '/api/gobackCourseWorks',
    method: 'post',
    params: {
      mid: mid
    }
  })
}

// 退回作品
export function notpassedCourse(data) {
  return request({
    url: '/api/toTuiHuiCourse',
    method: 'post',
    params: {
      widList: data.wid.toString(),
      subject: data.theme,
      content: data.content
    }
  })
}
