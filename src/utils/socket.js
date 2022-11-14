import { Message } from 'element-ui'
import { getToken } from '@/util/auth'
const oWebSock = {
  webSock: null,
  fMessageCallback: null,
  wsUrl: '',
  tryTime: 0,
  heartCheck: {
    timeout: 1000 * 5, // 60s
    timeoutObj: null,
    reset: function() {
      clearInterval(this.timeoutObj)
      this.start()
    },
    start: function() {
      this.timeoutObj = setInterval(function() {
        oWebSock.webSock.send('{"code":"-1"}')
      }, this.timeout)
    },
    end: function() {
      clearInterval(this.timeoutObj)
    }
  },
  /**
   * 初始化websocket
   * @param {Object} agentData 需要向后台传递的参数数据
   * @param {function} successCallback 接收到ws数据，对数据进行处理的回调函数
   */
  initWebsocket: function(agentData = null, successCallback = null) {
    if (typeof (WebSocket) === 'undefined') {
      Message.error('您的浏览器不支持WebSocket，无法获取数据')
      return false
    }

    const token = getToken()
    if (!token || this.webSock) {
      return
    }
    // ws请求完整地址
    const requestWsUrl = this.wsUrl + token
    const webSock = new WebSocket(requestWsUrl)

    this.fMessageCallback = successCallback
    // 接收ws后端返回的数据
    webSock.onmessage = (e) => {
      this.heartCheck.reset()
      if (this.fMessageCallback) {
        this.fMessageCallback(JSON.parse(e.data))
      }
    }
    webSock.onopen = () => {
      console.log('ws连接成功')
      this.heartCheck.start()
      if (agentData) {
        this.websocketSend(agentData)
      }
      this.tryTime = 0
    }
    webSock.onerror = () => {
      Message.error('ws连接异常，请稍候重试')
    }
    webSock.onclose = (e) => {
      this.heartCheck.end()
      this.webSocketClose(e)
    }
    this.webSock = webSock
  },

  /**
   * 发起websocket连接
   * @param {Object} agentData 需要向后台传递的参数数据
   */
  websocketSend: function(agentData) {
    const webSock = this.webSock
    // 添加状态判断，当为OPEN时，发送消息
    if (webSock.readyState === webSock.OPEN) { // webSock.OPEN = 1
      // 发给后端的数据需要字符串化
      webSock.send(JSON.stringify(agentData))
    }
    if (webSock.readyState === webSock.CLOSED) { // webSock.CLOSED = 3
      console.log('webSock.readyState=3')
      Message.error('ws连接异常，请稍候重试')
    }
  },

  // 关闭ws连接
  webSocketClose: function(e) {
    // e.code === 1000  表示正常关闭。 无论为何目的而创建, 该链接都已成功完成任务。
    // e.code !== 1000  表示非正常关闭。
    console.log(e)
    if (e && e.code !== 1000) {
      Message.error('ws连接异常，请稍候重试')
      // // 如果需要设置异常重连则可替换为下面的代码，自行进行测试
      if (this.tryTime < 10) {
        setTimeout(() => {
          this.webSock = null
          this.tryTime++
          this.initWebsocket()
          console.log(`第${this.tryTime}次重连`)
        }, 3 * 1000)
      } else {
        Message.error('重连失败！请稍后重试')
      }
    }
  },

  // 关闭websocket函数
  closeWebsocket: function() {
    if (this.webSock) {
      this.webSock.close() // 关闭websocket
      this.webSock.onclose() // 关闭websocket
      this.webSock = null
    }
  }
}

export default oWebSock

