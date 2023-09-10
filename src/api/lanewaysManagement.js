import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/Laneways/GetLanewaysList',
    method: 'get',
    params: params,
  })
}

//标记/清除设备故障
export function doEdit(data) {
  return request({
    url: '/Laneways/DisableOrEnable',
    method: 'post',
    data,
  })
}
