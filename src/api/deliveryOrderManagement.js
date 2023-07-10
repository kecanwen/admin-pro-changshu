import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Delivery/GetDeliveryList',
    method: 'get',
    params: params,
  })
}

export function doDelete(data) {
  return request({
    url: '/Delivery/Delete',
    method: 'post',
    data,
  })
}

export function getLikeMaterialsList(params) {
  return request({
    url: '/Delivery/GetLikeMaterialsList',
    method: 'get',
    params,
  })
}

export function Add0rUpdateAPI(data) {
  return request({
    url: '/Delivery/Add0rUpdate',
    method: 'post',
    data,
  })
}
//获取入库口
export function getckLocationCodeListApi(params) {
  return request({
    url: '/PlainLocations/GetckLocationCodeList',
    method: 'get',
    params,
  })
}

//获取货主
export function getTradingCompanysApi(params) {
  return request({
    url: '/ReceiveOrder/GetCargoOwnerOptions',
    method: 'get',
    params,
  })
}

//获取列表
export function GetUnitLoadListApi(params) {
  return request({
    url: '/Delivery/GetUnitLoadList',
    method: 'get',
    params,
  })
}
