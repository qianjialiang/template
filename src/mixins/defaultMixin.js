import Vue from 'vue'
import { parseTime } from '@/utils'
import { fQueryAreaTree } from '@/api/system'

Vue.mixin({
  data() {
    const nowDate = parseTime(new Date().getTime(), '{y}-{m}-{d}')
    return {
      aDate: [nowDate, nowDate],

      oQueryData: {},
      nMaxTime: new Date(nowDate).getTime(),
      oPickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > this.nMaxTime
        },
        shortcuts: [
          {
            text: '最近3天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '不限',
            onClick(picker) {
              picker.$emit('pick', [])
            }
          }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    // 区域树
    fQueryAreaTree() {
      fQueryAreaTree().then(res => {
        this.fClearAreaTree(res.data)
        // console.log(res.data)
        this.aAreaTree = res.data
      })
    },
    fClearAreaTree(arr) {
      arr.forEach(item => {
        const children = item.children || []
        if (children.length === 0) {
          item.children = null
          item.leaf = true
        } else {
          this.fClearAreaTree(children)
        }
      })
    },
    fNextTickSearch() {
      this.$refs.ReportTable.fNextTickSearch()
    },
    fGetDataList() {
      this.$refs.ReportTable.fGetDataList()
    },
    fNextTickGet() {
      this.$nextTick(() => {
        this.$refs.ReportTable.fGetDataList()
      })
    },
    fChangeDate() {
      if (this.aDate && this.aDate.length === 2) {
        this.oQueryData.startTime = this.aDate[0] + ' 00:00:00'
        this.oQueryData.endTime = this.aDate[1] + ' 23:59:59'
      } else {
        this.oQueryData.startDate = ''
        this.oQueryData.endDate = ''
      }
      this.fNextTickSearch()
    },
    fClearData() {
      this.aDate = []
    },
    fMixinAction(name, query, fDel, fGet, action = '删除', type = 'error', fFinally) {
      this.$confirm(`此操作将永久${action}  ${name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type
      }).then(() => {
        fDel(query).then((res) => {
          this.$message({
            type: 'success',
            message: `${action}成功!`
          })
          fGet && fGet(res)
        }).finally(() => {
          fFinally && fFinally()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${action}`
        })
      })
    }
  }
})
