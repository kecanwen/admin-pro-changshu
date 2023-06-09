import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Racks/GetRacksList',
    method: 'get',
    params: params,
  })
}

export function getPlainList(params) {
  return request({
    url: '/PlainLocations/GetPlainLocationsList',
    method: 'get',
    params: params,
  })
}

export function doEdit(data) {
  return request({
    url: '/Racks/AddOrUpdate',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/Racks/Delete',
    method: 'post',
    data,
  })
}

//入口
export function updateForbidInbound(data) {
  return request({
    url: '/Racks/UpdateForbidInbound',
    method: 'post',
    data,
  })
}

//出口
export function updateupForbidOutbound(data) {
  return request({
    url: '/Racks/UpdateupForbidOutbound',
    method: 'post',
    data,
  })
}

//禁止入 允许入
export function disableOrEnableInbound(data) {
  return request({
    url: '/RackLocations/DisableOrEnableInbound',
    method: 'post',
    data,
  })
}

//禁止出 允许出
export function disableOrEnableOutbound(data) {
  return request({
    url: '/RackLocations/DisableOrEnableOutbound',
    method: 'post',
    data,
  })
}

//一键禁止 一键允许
export function disableOrEnableAll(data) {
  return request({
    url: '/RackLocations/DisableOrEnableAll',
    method: 'post',
    data,
  })
}
