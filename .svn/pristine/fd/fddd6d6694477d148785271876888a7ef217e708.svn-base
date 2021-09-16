import request from '@/utils/request'

// 搜索全部作品
export function getWorksMes(data) {
  return request({
    url: '/api/getAllWorksByString',
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

// 下载作品资源
export function downAllWork() {
  return request({
    url: '/api/downloadAll',
    method: 'post'
  })
}

// 下载单个作品资源
export function downOneWork(wid) {
  return request({
    url: '/api/downloadOne',
    method: 'post',
    params: {
      wid: wid
    }
  })
}

// 直接进入决赛
export function overAcccess(list) {
  return request({
    url: '/api/overAcccess',
    method: 'post',
    params: {
      widList: list.toString()
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
