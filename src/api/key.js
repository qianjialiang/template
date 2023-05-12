import requestJson from '@/utils/requestJson'
// import request from '@/utils/request'
import axios from 'axios'
import qs from 'qs'
// import requestBlob from '@/utils/requestBlob'

export function fOauth2GetPublicKey() {
  return requestJson({
    url: '/auth/oauth2/getPublicKey',
    method: 'post',
    data: {}
  })
}

export function fWhiteSendSm4(data) {
  return requestJson({
    url: '/auth/white/sendSm4',
    method: 'post',
    data
  })
}

export function fSm2PublicKey(data) {
  return axios.post('/test3', qs.stringify(data), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res => {
    return res.data
  })
}

// 四川登录
export function fFactorAccountLogin(data) {
  return requestJson({
    url: '/auth/enterprise/quick/factorAccountLogin',
    method: 'post',
    data
  })
}

export function fSendSmsCodeByUuid(uuid) {
  return requestJson({
    url: '/auth/user/second/sendSmsCodeByUuid',
    method: 'post',
    data: {
      uuid
    }
  })
}

// 浙江登录
export function fAccountLogin(data) {
  return requestJson({
    url: '/auth/enterprise/quick/accountLogin',
    method: 'post',
    data
  })
}

export function fGetIdCardtype(data) {
  return requestJson({
    url: '/acl/app/relationType/getIdCardtype',
    method: 'post',
    data
  })
}

export function fQuickLogin(data) {
  console.log(JSON.stringify(data))
  return requestJson({
    url: '/auth/enterprise/quick/quickLogin',
    method: 'post',
    data
  })
}

