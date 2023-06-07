import request from '@/utils/request'

export function getTree(params) {
  return request({
    url: '/Menu/MenusList',
    method: 'get',
    params,
  })
}

export function doEdit(data) {
  return request({
    url: '/Menu/AddOrUpdate',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/Menu/Delete',
    method: 'post',
    data,
  })
}
