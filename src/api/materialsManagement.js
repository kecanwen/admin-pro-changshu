import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Materials/GetMaterialsList',
    method: 'get',
    params: params,
  })
}

export function UploadExcel(data) {
  return request({
    url: '/Materials/UploadExcel',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/Materials/AddOrUpdate',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/Materials/Delete',
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
