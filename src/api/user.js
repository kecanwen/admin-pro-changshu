import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA } from '@/config'
import { getToken } from '@/utils/token'

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/Account/getLoginToken',
    method: 'post',
    data,
  })
}

export async function socialLogin(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/socialLogin',
    method: 'post',
    data,
  })
}

export function getUserInfo() {
  let token = getToken()
  return request({
    url: '/Account/getUserInfo',
    method: 'get',
    params: { userId: token },
  })
}

export function logout() {
  return request({
    url: '/Account/logoutTo',
    method: 'get',
  })
}

export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data,
  })
}
