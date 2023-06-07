import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/RackLocations/GetRackLocationList',
    method: 'get',
    params: params,
  })
}

export function doEdit(data) {
  return request({
    url: '/RackLocations/AddOrUpdate',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/RackLocations/Delete',
    method: 'post',
    data,
  })
}
