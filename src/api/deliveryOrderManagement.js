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
