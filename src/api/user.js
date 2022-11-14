import request from '@/utils/request'
// import requestBlob from '@/utils/requestBlob'

export function fLogin(data) {
  return request({
    url: '/admin/account/login',
    method: 'post',
    data
  })
}

export function fLogout() {
  return request({
    url: '/admin/account/get',
    method: 'post'
  })
}

export function fGetAccountInfo() {
  return request({
    url: '/admin/account/get',
    method: 'post'
  })
}

export function fModifyPassword(data) {
  return request({
    url: '/admin/account/modifyPassword',
    method: 'post',
    data
  })
}
