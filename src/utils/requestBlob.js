import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 50000, // request timeout
  responseType: 'blob'
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'

    const { method } = config
    let data = {
      ...config.data
    }
    if (method === 'get') {
      data = {
        ...config.params
      }
    }
    if (store.getters.token) {
      data.token = store.getters.token
    }
    if (method === 'get') {
      config.params = {
        ...data
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

service.interceptors.response.use(
  response => {
    return response.data
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
