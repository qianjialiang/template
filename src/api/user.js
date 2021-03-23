import request from '@/utils/request'
// import requestBlob from '@/utils/requestBlob'

export function login(data) {
  return request({
    url: '/common/account/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/common/account/info',
    method: 'post'
  })
}
