import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/PlainLocations/GetPlainLocationsList',
    method: 'get',
    params: params,
  })
}

export function doEdit(data) {
  return request({
    url: '/PlainLocations/AddOrUpdate',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/PlainLocations/Delete',
    method: 'post',
    data,
  })
}

//禁入
export function updateForbidInbound(data) {
  return request({
    url: '/PlainLocations/UpdateForbidInbound',
    method: 'post',
    data,
  })
}

//禁出
export function updateupForbidOutbound(data) {
  return request({
    url: '/PlainLocations/UpdateupForbidOutbound',
    method: 'post',
    data,
  })
}
