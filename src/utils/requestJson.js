import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { sNowUrl } from '@/utils'

// create an axios instance
const service = axios.create({
  baseURL: sNowUrl, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['Content-Type'] = 'application/json'

    const { path, url } = config
    const sToken = store.getters.token || ''
    const arr = []
    if (path) {
      arr.push('path=' + path)
    }
    if (sToken) {
      arr.push('token=' + sToken)
    }

    const obj = {}
    if (config.data) {
      Object.keys(config.data).forEach(key => {
        const data = config.data[key]
        if (typeof data === 'string') {
          obj[key] = data.trim()
        } else {
          obj[key] = data
        }
      })
    }
    if (arr.length > 0) {
      config.url = url + '?' + arr.join('&')
    }
    config.data = JSON.stringify(obj)

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

    if (res.code !== 0) {
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
    } else {
      const vGateRes = res.data
      if (vGateRes.code !== 1) {
        Message({
          message: vGateRes.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(vGateRes)
      } else {
        return vGateRes
      }
    }
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
