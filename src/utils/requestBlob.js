import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import qs from 'qs'

// create an axios instance
let url = 'http://47.98.49.65:9000/showServer'
if (location && location.hostname !== 'localhost') {
  url = 'http://' + location.hostname + ':' + (location.port || 9000) + '/showServer'
}
const service = axios.create({
  // baseURL: 'http://47.98.49.65:9000/showServer', // url = base url + request url
  baseURL: url, // url = base url + request url
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
