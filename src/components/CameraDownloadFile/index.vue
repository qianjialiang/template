<template>
  <div class="playback-btn">
    <span v-show="deviceChannelId" class="playback-btn-span" @click="fOpenCameraDownloadFile"><i class="el-icon-download" /></span>
    <!--<el-button :disabled="!deviceChannelId" @click="fOpenCameraDownloadFile">
      <i class="el-icon-download" />
    </el-button>-->
    <el-dialog ref="PlayBackDiv" :visible.sync="bVisible" title="请选择视频下载时间段" append-to-body width="430px">
      <p class="top-alert"><i class="el-icon-warning" />提示：只能下载有录像文件的时间段,时间间隔最大15分钟</p>
      <el-form ref="oDownloadFileForm" :rules="oDownloadFileRules" label-width="40px" style="margin-top: 50px">
        <el-form-item label="日期" prop="day">
          <el-date-picker
            v-model="sDay"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="oDatePicker"
            style="width: 100%;"
            @change="fChangeDatePicker"
          />
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <div style="display: flex;">
            <el-time-picker
              v-model="sStartTime"
              :picker-options="{
                selectableRange: aSelectableRange
              }"
              value-format="HH:mm:ss"
              placeholder="任意时间点"
              @change="fChangeTimePicker"
            />
            <span style="margin: 0 10px;">至</span>
            <el-time-picker
              v-model="sStopTime"
              :picker-options="{
                selectableRange: aSelectableRangeTwo
              }"
              value-format="HH:mm:ss"
              placeholder="任意时间点"
            />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bVisible = false">取 消</el-button>
        <el-button type="primary" @click="fDeviceChannelDownloadFile">确 定</el-button>
      </div>
    </el-dialog>

    <div v-show="bLoadingAll" ref="TopLoading" class="top-loading">
      <div>
        <p><i class="el-icon-loading" /></p>
        <p>正在下载视频</p>
        <p><el-slider :value="percentage" disabled :show-tooltip="false" /></p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  fDeviceChannelDownloadFile,
  fQueryRecordFileList
} from '@/api/device'
import { parseTime } from '@/utils'

export default {
  name: 'CameraDownloadFile',
  props: {
    deviceChannelId: {
      type: String,
      default: ''
    }
  },
  data() {
    const sDay = parseTime(new Date(), '{y}-{m}-{d}')
    const sNowTime = sDay + ' 00:00:00'
    return {
      bVisible: false,
      sDay,
      sStartTime: '00:00:00',
      sStopTime: '00:00:00',
      oDatePicker: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      sMinTime: sNowTime,
      sMaxTime: sNowTime,
      // sMinTimeTwo: sNowTime,
      // sMaxTimeTwo: sNowTime,
      oDownloadFileForm: {},
      oDownloadFileRules: {},

      percentage: 0,
      bLoadingAll: false
    }
  },
  computed: {
    aSelectableRange() {
      if (!this.sMinTime || !this.sMaxTime) {
        return '00:00:00 - 00:00:00'
      }
      return this.sMinTime.match(/\d{2}:\d{2}:\d{2}/)[0] + ' - ' + this.sMaxTime.match(/\d{2}:\d{2}:\d{2}/)[0]
    },
    aSelectableRangeTwo() {
      const oStartTime = new Date(this.sDay + ' ' + this.sStartTime)
      let sMinTime = this.sMaxTime
      let sMaxTime = this.sMaxTime
      if (oStartTime < new Date(this.sMaxTime)) {
        sMinTime = this.sStartTime
        const sMaxTimeTwo = oStartTime.getTime() + 1000 * 60 * 15
        if (sMaxTimeTwo >= new Date(this.sMaxTime)) {
          sMaxTime = this.sMaxTime
        } else {
          sMaxTime = parseTime(sMaxTimeTwo)
        }
      }

      if (!sMinTime || !sMaxTime) {
        return '00:00:00 - 00:00:00'
      }
      return sMinTime.match(/\d{2}:\d{2}:\d{2}/)[0] + ' - ' + sMaxTime.match(/\d{2}:\d{2}:\d{2}/)[0]
    }
  },
  mounted() {
    document.body.appendChild(this.$refs.TopLoading)
  },
  methods: {
    fOpenCameraDownloadFile() {
      const sIndexTime = this.$$('#PlayBackVideo-stamp-index .index-title').text()
      const val = this.$$('#PlayBackVideo-stamp-picker').val()
      if (val) {
        this.sDay = val
      }
      const sTime = this.sDay
      const sNowTime = sTime + ' 00:00:00'
      this.sStartTime = sIndexTime + ':00'
      this.sStopTime = sIndexTime + ':00'
      this.sMinTime = sNowTime
      this.sMaxTime = sNowTime
      // this.sMinTimeTwo = sNowTime
      // this.sMaxTimeTwo = sNowTime

      this.bVisible = true
      this.fChangeDatePicker()
    },
    fChangeDatePicker() {
      const sTime = this.sDay
      fQueryRecordFileList({
        deviceChannelId: this.deviceChannelId,
        startTime: sTime + ' 00:00:00',
        endTime: sTime + ' 23:59:59'
      }).then(res => {
        let startTime = sTime + ' 00:00:00'
        let stopTime = sTime + ' 00:00:00'
        if (res.data && res.data.length > 0) {
          startTime = res.data[0].startTime
          if (new Date(startTime) < new Date(stopTime)) {
            startTime = sTime + ' 00:00:00'
          }
          stopTime = res.data[res.data.length - 1].stopTime
          if (new Date(stopTime) > new Date(sTime + ' 23:59:59')) {
            stopTime = sTime + ' 23:59:59'
          }
        }
        this.sMinTime = startTime
        this.sMaxTime = stopTime
      })
    },
    fChangeTimePicker() {
      this.sStopTime = this.sStartTime
    },
    fDeviceChannelDownloadFile() {
      if (this.sStartTime === this.sStopTime) {
        this.$message.warning('开始时间和结束时间一致，请重新选择！')
        return
      }
      fDeviceChannelDownloadFile({
        deviceChannelId: this.deviceChannelId,
        startTime: this.sDay + ' ' + this.sStartTime,
        stopTime: this.sDay + ' ' + this.sStopTime
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .playback-btn{
    position: absolute;
    bottom: 100px;
    right: 10px;
    z-index: 2000;
    padding: 5px;
    background: rgba(0,0,0,.5);
    color: #fff;

    .playback-btn-span{
      padding: 3px 8px;
      border: 1px solid #e6e6e6;
      cursor: pointer;
    }
  }
  .top-alert{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    background: #EEF7FD;
    margin: 0;
    height: 40px;
    line-height: 40px;
    color: #4E538E;
    padding: 0 20px;
    >i{
      margin-right: 8px;
      color: #2c68ff;
    }
  }
</style>
