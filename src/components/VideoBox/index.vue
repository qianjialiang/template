<template>
  <div ref="videoBox" class="video-box hasChange">
    <ul class="video-box-ul">
      <li
        v-for="item in videoList"
        :key="item.index"
        :class="{'hover': nVideoIndex === item.index}"
        :style="{height: divBox, width: divBox}"
        @click="fClickVideo($event, item)"
      >
        <play-video
          ref="PlayVideo"
          :div-id="divId + item.divId"
          :play-back="item.playBack"
          :control="item.control"
        />
      </li>
    </ul>
    <div class="video-box-btn">
      <template v-if="!noChange">
        <el-button v-for="item in aBtnList" :key="item.key" class="not-min" :class="{'hover': item.key === nVideoNum}" :disabled="bAutoPlay" @click="fChangeNum(item.key)"><svg-icon :icon-class="`btn${item.key}`" /></el-button>
        <el-button class="not-min" :disabled="bAutoPlay" @click="fDisposeAll"><svg-icon icon-class="closeAll" /></el-button>
      </template>
      <el-button v-if="bShow" class="not-min"><screenfull :elem="$refs.videoBox" /></el-button>
    </div>
  </div>
</template>

<script>
import Screenfull from '@/components/Screenfull'
export default {
  name: 'VideoBox',
  components: {
    Screenfull
  },
  props: {
    noChange: {
      type: Boolean,
      default: false
    },
    divId: { // 播放器id
      type: String,
      default: 'now'
    },
    bAutoPlay: {
      type: Boolean
    }
  },
  data() {
    const aBtnList = []
    for (let i = 0; i < 6; i++) {
      const key = i + 1
      aBtnList.push({
        key,
        name: key
      })
    }
    return {
      aBtnList,
      aVideoData: [],
      nVideoNum: 0,
      nVideoIndex: 0,
      nGroupIndex: 0,
      nDeviceIndex: 0,
      bShow: false,
      oAutoPlayTimer: null,

      autoPlay: false
    }
  },
  computed: {
    // ...mapGetters([
    //   'socketData'
    // ]),
    videoList() {
      return this.aVideoData.slice(0, this.nVideoNum * this.nVideoNum)
    },
    divBox() {
      return parseFloat(100 / this.nVideoNum) + '%'
      // return `calc(${parseFloat(100 / this.nVideoNum)}%)`
    },
    videoHeight() {
      return parseFloat(825 / this.nVideoNum)
    }
  },
  watch: {
    autoPlay(val) {
      this.$emit('update:bAutoPlay', val)
    }
  },
  created() {
    this.fChangeNum(2)
  },
  mounted() {
    this.bShow = true
  },
  beforeDestroy() {
    this.fCloseAutoPlayVideo()
  },
  methods: {
    fPlayVideo(camera) {
      // console.log(this.videoList)
      // console.log()
      this.aVideoData[this.nVideoIndex].control = camera.hasPtz === 1
      this.aVideoData[this.nVideoIndex].oCamera = camera
      this.$refs.PlayVideo[this.nVideoIndex].fPlayVideo({
        ...camera
      })
      if (this.nVideoIndex + 1 < (this.nVideoNum * this.nVideoNum)) {
        this.nVideoIndex++
      }
    },
    fPlayVideoAll(arr) {
      const length = arr.length
      const num = this.fPlayVideoAllMaxNum(length)
      const max = length > (num * num) ? (num * num) : length
      const NewArr = arr.slice(0, max)
      this.fChangeNum(num)
      this.nVideoIndex = 0
      this.$nextTick(() => {
        NewArr.forEach(camera => {
          this.fPlayVideo(camera)
        })
      })
    },
    fPlayVideoAllMaxNum(length) {
      let max = 1
      for (let i = 0; i < this.aBtnList.length; i++) {
        const num = this.aBtnList[i].key
        max = num
        if (length <= num * num) {
          break
        }
      }
      return max
    },
    fChangeNum(num) { // 切换画面数
      if (this.nVideoNum === num) {
        return
      }
      // const oldNum = this.nVideoNum

      this.nVideoNum = num
      for (let i = this.aVideoData.length; i < (num * num); i++) {
        this.aVideoData.push({
          index: i,
          control: false,
          playBack: false,
          divId: 'playerVideo' + i
        })
      }
      // for (let i = num * num; i < oldNum * oldNum; i++) {
      //   this.aPlayData[i] = null
      // }
    },
    fClickVideo(event, item) {
      this.nVideoIndex = item.index
      this.$emit('fClickVideo', item.oCamera || {})
    },
    // 轮询
    fAutoPlayVideo(arr) { // 开始轮巡
      if (this.oAutoPlayTimer) {
        clearTimeout(this.oAutoPlayTimer)
        this.oAutoPlayTimer = null
      }
      this.autoPlay = true
      // this.fDisposeAll()
      this.nGroupIndex = 0
      this.nDeviceIndex = 0
      this.aAutoPlayList = arr
      this.fAutoPlayVideoTime()
    },
    fAutoPlayVideoTime() { // 轮巡切换组
      let obj = this.aAutoPlayList[this.nGroupIndex]
      this.nDeviceIndex = 0
      if (!obj) {
        this.nGroupIndex = 0
        obj = this.aAutoPlayList[this.nGroupIndex]
      }
      this.fChangeNum(obj.frameNum)

      this.$nextTick(() => {
        this.fAutoPlayVideoAll()
      })
    },
    fAutoPlayVideoAll() { // 轮巡组里面的画面控制
      const obj = this.aAutoPlayList[this.nGroupIndex]
      this.nVideoIndex = 0
      const arr = obj.deviceChannelList
      const max = this.nDeviceIndex + (obj.frameNum * obj.frameNum)
      for (let i = this.nDeviceIndex; i < max && i < arr.length; i++) { // 播放画面
        this.fPlayVideo(arr[i])
        this.nDeviceIndex++
      }
      for (let i = this.nVideoIndex; i < this.videoList.length; i++) { // 关闭遗留的老画面
        this.$refs.PlayVideo[i].dispose()
      }
      this.oAutoPlayTimer = setTimeout(() => {
        if (this.nDeviceIndex === arr.length) {
          this.nGroupIndex++
          this.fAutoPlayVideoTime()
        } else {
          this.fAutoPlayVideoAll()
        }
      }, obj.frameSwitchTime * 1000)
    },
    fAgainAutoPlayVideo() { // 恢复轮巡
      const obj = this.aAutoPlayList[this.nGroupIndex]
      const arr = obj.deviceChannelList
      this.oAutoPlayTimer = setTimeout(() => {
        if (this.nDeviceIndex === arr.length) {
          this.nGroupIndex++
          this.fAutoPlayVideoTime()
        } else {
          this.fAutoPlayVideoAll()
        }
      }, obj.frameSwitchTime * 1000)
    },
    fCloseAutoPlayVideo(close = false) { // 停止轮巡
      this.autoPlay = close
      if (this.oAutoPlayTimer) {
        clearTimeout(this.oAutoPlayTimer)
        this.oAutoPlayTimer = null
      }
    },
    fDisposeAll() { // 关闭所有画面
      for (let i = 0; i < this.videoList.length; i++) {
        this.$refs.PlayVideo[i].dispose()
        // this.aPlayData[i] = null
      }
      this.nVideoIndex = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.video-box{
  width: 100%;
  height: 100%;
  border: 1px solid #dfe6ec;
  border-radius: 3px;
  position: relative;
  background: #fff;

  .video-box-ul{
    width: 100%;
    height: 100%;
    >li{
      float: left;
      border: 4px solid #000;
      &.alarm{
        border-color: #E72529;
      }
      &.hover,&:hover{
        border-color: #1890ff;
        //border-color: #1890FF;
      }
    }
  }

  .video-box-btn{
    display: none;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 28px;
    padding: 6px 15px;
    border-top: 1px solid #dfe6ec;
    text-align: right;

    .el-button{
      display: inline-block;
      height: 16px;
      font-size: 16px;
      /*padding: 0 8px;*/
      line-height: 16px;
      /*border: 1px solid #dfe6ec;*/
      cursor: pointer;
      color: #909399;
      padding: 0;
      border-radius: 0;
      border: 0;

      &:hover,&.hover{
        /*background: #21B4AD;*/
        color: #1890ff;
      }

      &.is-disabled{
        color: #C0C4CC;
        cursor: no-drop;
      }
    }
    .el-button+.el-button{
      margin-left: 5px;
    }
  }

  &.hasChange{
    padding-bottom: 28px;
    .video-box-btn{
      display: block;
    }
  }
}
</style>
