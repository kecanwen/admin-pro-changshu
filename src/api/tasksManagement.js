import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Tasks/GetTasksList',
    method: 'get',
    params: params,
  })
}

export function getArchivedsList(params) {
  return request({
    url: '/Tasks/GetArchivedsList',
    method: 'get',
    params: params,
  })
}
//强制完成任务
export function doComplete(data) {
  return request({
    url: '/Tasks/DoComplete',
    method: 'post',
    data,
  })
}
//取消任务
export function doCancel(data) {
  return request({
    url: '/Tasks/DoCancel',
    method: 'post',
    data,
  })
}
