import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Roles/GetRoleList',
    method: 'get',
    params,
  })
}

export function getMenuTrees(params) {
  return request({
    url: '/Roles/MenuTrees',
    method: 'get',
    params,
  })
}

export function setDoAllots(data) {
  return request({
    url: '/Roles/DoAllots',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/Roles/AddOrUpdate',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/Roles/Delete',
    method: 'post',
    data,
  })
}

export function setRole(data) {
  return request({
    url: '/Roles/SaveUserRole',
    method: 'post',
    data,
  })
}
