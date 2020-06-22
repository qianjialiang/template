import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
// import { getToken } from '@/utils/auth'
import qs from 'qs'

// create an axios instance
// let url = 'http://47.98.49.65:9000/showServer'
let url = 'http://www.showplusplus.com:9000/showServer'
if (location && location.hostname !== 'localhost') {
  url = 'http://' + location.hostname + ':' + (location.port || 9000) + '/showServer'
}
const service = axios.create({
  // baseURL: 'http://47.98.49.65:9000/showServer', // url = base url + request url
  baseURL: url, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'

    const { method } = config
    let data = {
      ...config.data
    }
    if (store.getters.token) {
      if (method === 'get') {
        config.params.token = store.getters.token
      } else {
        if (data) {
          data.token = store.getters.token
        } else {
          data = {
            token: store.getters.token
          }
        }
      }
      // config.headers['X-Token'] = getToken()
    }
    if (method === 'get') {
      config.params = {
        ...config.params
      }
    } else {
      config.data = qs.stringify(data)
    }
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
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      Message({
        message: res.error || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      if (res.code === 401) {
        // to re-login
        MessageBox.confirm('你的账号已经在其他地方登录，请重新登录', '退出登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '无视',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.error || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.error,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
