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
//货位禁入/允许
export function disableOrEnableInbound(data) {
  return request({
    url: '/RackLocations/DisableOrEnableInbound',
    method: 'post',
    data,
  })
}
//货位禁出/允许
export function disableOrEnableOutbound(data) {
  return request({
    url: '/RackLocations/DisableOrEnableOutbound',
    method: 'post',
    data,
  })
}
//货位一键禁止/一键允许
export function disableOrEnableAll(data) {
  return request({
    url: '/RackLocations/DisableOrEnableAll',
    method: 'post',
    data,
  })
}
