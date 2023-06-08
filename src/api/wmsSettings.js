import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/WmsSettings/GetAllWmsSettingList',
    method: 'get',
    params: params,
  })
}

export function doEdit(data) {
  return request({
    url: '/WmsSettings/AddOrUpdate',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/WmsSettings/Delete',
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
export function getMaterialsTypeOptionApi(params) {
  return request({
    url: '/ContainerType/GetMaterialsTypeOption',
    method: 'get',
    params,
  })
}
