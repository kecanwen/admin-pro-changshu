import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Warehouses/GetWarehousesList',
    method: 'get',
    params: params,
  })
}

export function doEdit(data) {
  return request({
    url: '/Warehouses/AddOrUpdate',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/Warehouses/Delete',
    method: 'post',
    data,
  })
}
