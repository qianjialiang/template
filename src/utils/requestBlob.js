import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import qs from 'qs'
import { fGetUrl } from '@/utils'

// create an axios instance
const service = axios.create({
  baseURL: fGetUrl(), // url = base url + request url
  timeout: 50000, // request timeout
  responseType: 'blob'
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'

    const { method } = config
    if (store.getters.token) {
      if (method === 'get') {
        config.params.token = store.getters.token
      } else {
        if (config.data) {
          config.data.token = store.getters.token
        } else {
          config.data = {
            token: store.getters.token
          }
        }
      }
    }
    if (method === 'get') {
      config.params = {
        ...config.params
      }
    } else {
      config.data = qs.stringify(config.data)
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    return response.data
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
