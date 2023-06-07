import request from '@/utils/request'

export function queryManagerLocationApi(params) {
  return request({
    url: '/RackLocations/GetxRackLocationList',
    method: 'get',
    params,
  })
}

export function getMaterialsTypeOptionApi(params) {
  return request({
    url: '/ContainerType/GetMaterialsTypeOption',
    method: 'get',
    params,
  })
}

export function getMaterialsListApi(params) {
  return request({
    url: '/RackLocations/GetMaterialsList',
    method: 'get',
    params,
  })
}

export function AddxGroupApi(data) {
  return request({
    url: '/RackLocations/AddxGroup',
    method: 'post',
    data,
  })
}

export function DeletexGroupApi(data) {
  return request({
    url: '/RackLocations/DeletexGroup',
    method: 'post',
    data,
  })
}
