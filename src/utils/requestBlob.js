import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
// import { getToken } from '@/utils/auth'
import qs from 'qs'
import { sNowUrl, parseTime } from '@/utils'
import { saveAs } from 'file-saver'

// create an axios instance
const service = axios.create({
  baseURL: sNowUrl, // url = base url + request url
  responseType: 'blob',
  timeout: 0 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'

    const { method, fDownLoad } = config
    // do something before request is sent
    const sToken = store.getters.token || ''
    const data = {
      ...config.data
    }
    if (sToken) {
      data.token = sToken
    }
    if (method === 'get') {
      config.params = data
    } else {
      config.data = qs.stringify(data)
    }

    if (fDownLoad) {
      config.onDownloadProgress = (progressEvent) => {
        // 对原生进度事件的处理
        fDownLoad(progressEvent)
      }
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
    const { noDownload, accept, title } = response.config
    const disposition = response.headers['content-disposition']
    let fileName = (title || '') + parseTime(new Date(), '{y}{m}{d}{h}{i}{s}') + '.' + (accept || 'xlsx')

    if (disposition) {
      fileName = disposition && disposition.replace('attachment;filename=', '')
    }
    const res = response.data
    if (!res.code && res.code !== 0) {
      if (!noDownload) {
        // if (!disposition) {
        //   Message({
        //     message: '文件不存在',
        //     type: 'error',
        //     duration: 5 * 1000
        //   })
        //   return
        // }
        saveAs(response.data, fileName)
      }
    } else if (res.code !== 0) {
      if (!(res.code === -1 && res.msg === '未查询到信息')) {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }

      if (res.code === 1001) {
        store.dispatch('user/resetToken')
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
    return res
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
