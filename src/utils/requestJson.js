/* eslint-disable no-undef */
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { parseTime } from '@/utils'
import hmacSHA256 from 'crypto-js/hmac-sha256'

// create an axios instance
const service = axios.create({
  // baseURL: 'https://tpass.sichuan.chinatax.gov.cn:8443/sys-api/v1.0/',
  // baseURL: sNowUrl, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['Content-Type'] = 'application/json'
    config.headers['X-SM4-INFO'] = '0'
    config.headers['X-TEMP-INFO'] = store.getters.uuid || ''

    config.headers['X-APP-CLIENTID'] = oKey.client_id

    const obj = {
      zipCode: '0',
      access_token: store.getters.token,
      signtype: 'HMacSHA256'
    }
    const key = store.getters.newKey
    let sData = ''
    const { url, method, data } = config
    if (method === 'post' && (
      url === '/auth/oauth2/getPublicKey' ||
      url === '/auth/white/sendSm4' ||
      url === '/auth/user/logout' ||
      url === '/auth/user/checklogin' ||
      url === '/auth/qrcode/verifyQRCode' ||
      url === '/auth/message/sendSmsCode' ||
      url === '/auth/oauth2/revokeToken' ||
      url === '/auth/white/getAreCode' ||
      url === '/auth/white/getSecondAuthInfo' ||
      url.includes('/auth/message/captchaImage')
    )) {
      obj.encryptCode = '0'
      obj.datagram = JSON.stringify(data)
    } else {
      sData = oKey.sm4.encrypt(JSON.stringify(data), oKey.keyFilter(key))
      obj.datagram = sData
      obj.encryptCode = '2'
    }
    obj.timestamp = parseTime(new Date(), '{y}{m}{d}{h}{i}{s}')
    obj.signature = hmacSHA256(obj.zipCode + obj.encryptCode + sData + obj.timestamp + obj.signtype, key).toString()
    // const { path, url } = config
    // const sToken = store.getters.token || ''
    // const arr = []
    // if (path) {
    //   arr.push('path=' + path)
    // }
    // if (sToken) {
    //   arr.push('token=' + sToken)
    // }

    // const obj = {}
    // if (config.data) {
    //   Object.keys(config.data).forEach(key => {
    //     const data = config.data[key]
    //     if (typeof data === 'string') {
    //       obj[key] = data.trim()
    //     } else {
    //       obj[key] = data
    //     }
    //   })
    // }
    // if (arr.length > 0) {
    //   config.url = url + '?' + arr.join('&')
    // }
    // config.data = JSON.stringify(obj)
    config.data = obj
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    if (res.code !== 1000) {
      if (!(res.code === -1 && res.msg === '未查询到信息')) {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }

      if (res.code === 1001) {
        // to re-login
        // MessageBox.confirm('你的账号已经在其他地方登录，请重新登录', '退出登录', {
        //   confirmButtonText: '重新登录',
        //   cancelButtonText: '无视',
        //   type: 'warning'
        // }).then(() => {
        //   store.dispatch('user/resetToken')
        // })
        store.dispatch('user/resetToken')
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    }
    return res
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
