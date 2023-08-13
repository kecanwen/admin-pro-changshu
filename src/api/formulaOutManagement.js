import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Delivery/GetSellOrderDeliveryList',
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
    url: '/Delivery/SellOrderAdd0rUpdate',
    method: 'post',
    data,
  })
}
//获取配方
export function getckLocationCodeListApi(params) {
  return request({
    url: '/Delivery/GetSellOrderOptions',
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

//根据获取出库信息列表
export function GetUnitLoadListApi(params) {
  return request({
    url: '/Delivery/GetSellOrderUnitLoadList',
    method: 'get',
    params,
  })
}
