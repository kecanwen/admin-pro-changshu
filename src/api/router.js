import request from '@/utils/request'
import { getToken } from '@/utils/token'

export function getList(params) {
  let token = getToken()
  return request({
    url: '/Home/getMenus?userId=' + token,
    method: 'get',
    params,
  })
}
