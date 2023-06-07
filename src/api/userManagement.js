import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Users/GetUserList',
    method: 'get',
    params: params,
  })
}

export function doEdit(data) {
  return request({
    url: '/Users/AddOrUpdate',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/Users/Delete',
    method: 'post',
    data,
  })
}
