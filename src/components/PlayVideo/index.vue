<template>
  <div class="player-video-div" style="position: relative;height: 100%;overflow-y: hidden;">
    <div :id="divId" class="video-div" :class="{'has-control': control}" style="height: 100%" @click="fClickVideo" />

    <el-select v-show="playBack && bPlay" v-model="oPlayData.location" class="player-video-select" placeholder="请选择" @change="fChangeLocation">
      <el-option label="服务器" :value="2" />
      <el-option label="设备" :value="3" />
    </el-select>

    <camera-download-file v-if="playBack" :device-channel-id="oPlayData && oPlayData.deviceChannelId" />
  </div>
</template>

<script>
import CameraDownloadFile from '../CameraDownloadFile'

import { fFileUpload } from '@/api/home'
import { fScreenCaptureAdd } from '@/api/device'

export default {
  // name: 'PlayVideo',
  components: { CameraDownloadFile },
  props: {
    playBack: { // 是否回放
      type: Boolean,
      default: false
    },
    control: { // 云台控制
      type: Boolean,
      default: false
    },
    divId: { // 播放器id
      type: String,
      default: 'playerVideo'
    }
  },
  data() {
    const nLocation = this.$Type === 3 ? 3 : 2
    return {
      oPlayVideo: null,
      bPlay: false,

      oInitTimer: null,
      nLocation,
      oPlayData: {
        location: nLocation
      }
    }
  },
  watch: {
    playBack() {
      this.fInit()
    }
  },
  mounted() {
    this.fInitVideo()
  },
  beforeDestroy() {
    if (this.oPlayVideo) {
      this.oPlayVideo.dispose()
      this.oPlayVideo = null
    }
  },
  methods: {
    fInit() {
      // 重新初始化播放器
      if (this.oInitTimer) {
        clearTimeout(this.oInitTimer)
        this.oInitTimer = null
      }
      this.oInitTimer = setTimeout(this.fInitVideo, 500)
    },
    fInitVideo() {
      // 初始化播放器
      this.bPlay = false
      if (this.oPlayVideo) {
        this.oPlayVideo.dispose()
        this.oPlayVideo = null
      }
      // eslint-disable-next-line no-undef,new-cap
      this.oPlayVideo = new showVideo.createVideo({
        id: this.divId,
        playBack: this.playBack
      })
    },
    fPlayVideo(playData, location = this.nLocation) {
      // 播放视频
      const {
        deviceChannelId,
        channelName,
        channelNum,
        streamKind
      } = playData

      const obj = {
        deviceChannelId,
        channelName,
        channelNum,
        streamKind,
        location
      }

      this.oPlayData = {
        ...playData,
        location
      }
      this.bPlay = true
      this.oPlayVideo.setVideoData(obj, {
        fPlayFun: this.fPlayFun,
        fPlayController: this.fPlayController
      })
    },
    fChangeLocation(location) {
      this.fPlayVideo(this.oPlayData, location)
    },
    dispose() {
      // 销毁播放器
      this.oPlayVideo.dispose()
    },
    fClickVideo(e) {
      const oTarget = e.target
      if (oTarget.tagName === 'I') {
        const ptzCommand = oTarget.getAttribute('ptzCommand')
        if (ptzCommand === '91') {
          const oJQTarget = this.$$(oTarget)
          if (oJQTarget.is('.loading')) {
            return
          }

          // 监测是否有画面
          const video = this.$$('#' + this.divId + '-video').get(0)
          const scale = 1

          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth * scale
          canvas.height = video.videoHeight * scale
          canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)

          const sBase64 = canvas.toDataURL()
          if (sBase64.indexOf('base64') === -1) {
            this.$message.warning('暂无画面')
            return
          }

          oJQTarget.addClass('loading')

          const obj = {
            deviceChannelId: this.oPlayData.deviceChannelId
          }

          const parts = sBase64.split(';base64,')
          const contentType = parts[0].split(':')[1]
          const suffix = contentType.split('/')[1] || 'png'
          const raw = window.atob(parts[1])
          const rawLength = raw.length
          const uInt8Array = new Uint8Array(rawLength)
          for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i)
          }
          // const blob = new Blob([uInt8Array], { type: contentType })
          const file = new File([uInt8Array], obj.deviceChannelId + '.' + suffix, { type: contentType })

          fFileUpload(file).then(res => {
            obj.fileUrl = res.data.url
            fScreenCaptureAdd(obj).then(() => {
              this.$notify.success({
                title: '截图成功',
                message: res.data.fileName
              })
            }).catch(() => {
              this.$notify.error({
                title: '截图失败'
              })
            }).finally(() => {
              oJQTarget.removeClass('loading')
            })
          }).catch(() => {
            oJQTarget.removeClass('loading')
          })
        }
      }
    },
    fPlayFun(err) {
      console.log(err)
    },
    fPlayController(err) {
      if (err.code !== 0) {
        this.$message.error(err.msg || '当前有更高权限的用户正在使用!')
      }
    }
  }
}
</script>

<style lang="scss">
#video-top-yun {
  right: 10px;
  bottom: 50px;
}
.player-video-select{
  position: absolute;
  left: 170px;
  bottom: 58px;
}
</style>
