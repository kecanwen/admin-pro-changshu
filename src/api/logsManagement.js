import request from '@/utils/request'

export function getLogsList(params) {
  return request({
    url: '/Logs/GetLogsList',
    method: 'get',
    params: params,
  })
}
