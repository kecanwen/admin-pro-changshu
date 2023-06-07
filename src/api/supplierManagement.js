import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Supplier/GetSupplierList',
    method: 'get',
    params: params,
  })
}

export function doEdit(data) {
  return request({
    url: '/Supplier/AddOrUpdate',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/Supplier/Delete',
    method: 'post',
    data,
  })
}
