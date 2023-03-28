<template>
  <div style="height: 100%">
    <div ref="TablePageBtn" class="table-page-btn">
      <div class="filter-container">
        <slot :search="fSearchDataList" :clear="fClearDataList" />
      </div>

      <div class="filter-container">
        <div class="filter-item fr">
          <slot name="btn" />
        </div>
      </div>
    </div>

    <slot name="table" :list="filterData" :indexMethod="indexMethod" :nowHeight="nowHeight">
      <el-table
        ref="elTable"
        :data="filterData"
        :height="nowHeight"
        :header-cell-style="{background:'#f6f7fb'}"
        :max-height="maxHeight"
        style="width: 100%"
        :row-key="rowKey"
        @selection-change="selectionChange"
        @select="select"
        @select-all="selectAll"
      >
        <el-table-column v-if="selection" type="selection" width="50" align="center" />
        <el-table-column
          type="index"
          label="序号"
          :index="indexMethod"
          width="60"
          align="center"
        />
        <slot name="main" :count="oData.count" />
      </el-table>
    </slot>

    <el-pagination
      v-if="!noPage"
      :current-page.sync="oPageData.page"
      :page-sizes="[10, 20, 30, 50]"
      :page-size.sync="oPageData.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="oData.count"
      background
      @size-change="fChangePage"
      @current-change="fChangePage"
    />
  </div>
</template>

<script>

export default {
  props: {
    constData: {
      type: Object,
      default: null
    },
    queryData: {
      type: Object,
      default: null
    },

    getFunction: {
      type: Function,
      default: null
    },
    autoGet: {
      type: Boolean,
      default: true
    },
    loopData: {
      type: Function,
      default: null
    },
    falsePage: {
      type: Boolean,
      default: false
    },
    noPage: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: null
    },
    maxHeight: {
      type: String,
      default: null
    },
    selection: {
      type: Boolean,
      default: false
    },
    rowKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      oData: {
        list: [],
        count: 0
      },
      oPageData: {
        page: 1,
        limit: 10
      },
      oQueryData: null,

      aChangeData: [],
      nowHeight: null
    }
  },
  computed: {
    aChangeIndex() {
      return this.aChangeData.map(item => {
        return item[this.rowKey]
      })
    },
    filterData() {
      if (this.falsePage) {
        const page = this.oPageData.page
        const limit = this.oPageData.limit
        return this.oData.list.slice((page - 1) * limit, page * limit)
      }
      return this.oData.list
    }
  },
  watch: {
    queryData(val) {
      this.oQueryData = val
    }
  },
  created() {
    this.oQueryData = this.queryData
    if (this.autoGet === true) {
      this.fGetDataList()
    }
  },
  mounted() {
    if (!this.maxHeight) {
      const height = this.$el.clientHeight - Math.ceil(this.$refs.TablePageBtn.clientHeight) - (this.noPage ? 0 : 42)
      this.nowHeight = this.height || height || null
    }
  },
  methods: {
    indexMethod(index) {
      return (this.oPageData.page - 1) * this.oPageData.limit + index + 1
    },
    fDataList(res) {
      const arr = res.data || []
      if (this.loopData) {
        this.oData.list = this.loopData(arr)
      } else {
        this.oData.list = arr
      }

      if (this.rowKey && this.selection && this.aChangeIndex.length > 0) {
        this.$nextTick(() => {
          this.oData.list.forEach(item => {
            const id = item[this.rowKey]
            if (id) {
              const index = this.aChangeIndex.indexOf(id)
              if (index !== -1) {
                this.$refs.elTable.toggleRowSelection(item, true)
              }
            }
          })
        })
      }

      let count = parseInt(res.count || res.totalSize)
      if (this.falsePage) {
        count = this.oData.list.length
      }
      this.oData.count = count
    },
    fGetDataList() {
      const obj = {
        ...this.constData,
        ...this.oPageData
      }
      // obj.limit = this.oPageData.limit
      // obj.page = (this.oPageData.page - 1)
      for (const key in this.oQueryData) {
        const data = this.oQueryData[key]
        if (data || data === 0) {
          obj[key] = data
        }
      }
      if (!this.getFunction) {
        return
      }
      console.log(obj)

      this.$emit('fGetData')
      this.getFunction(obj).then(res => {
        this.fDataList(res)
      }).catch(() => {
        this.oData.list = []
        this.oData.count = 0
      })
    },
    fNextTickSearch() {
      this.$nextTick(() => {
        this.fSearchDataList()
      })
    },
    fSearchDataList() {
      this.oPageData.page = 1
      this.fGetDataList()
    },
    fClearDataList() {
      this.oPageData = {
        page: 1,
        limit: 10
      }
      const obj = {}
      for (const key in this.oQueryData) {
        obj[key] = ''
      }
      this.oQueryData = obj
      this.$emit('update:queryData', obj)
      this.$emit('fClearData')

      this.fGetDataList(true)
    },
    fChangePage() {
      if (!this.falsePage) {
        this.fGetDataList()
      }
    },
    selectionChange(selection) {
      this.$emit('selection-change', selection)
    },
    select(selection, row) {
      const id = row[this.rowKey]
      if (id) {
        const index = this.aChangeIndex.indexOf(id)
        if (index === -1) {
          this.aChangeData.push(row)
        } else {
          this.aChangeData.splice(index, 1)
        }
      }
      this.$emit('select', this.aChangeData)
    },
    selectAll(selection) {
      const isDel = selection.length === 0
      this.filterData.forEach(row => {
        const id = row[this.rowKey]
        if (id) {
          const index = this.aChangeIndex.indexOf(id)
          if (index === -1 && !isDel) {
            this.aChangeData.push(row)
          } else if (isDel) {
            this.aChangeData.splice(index, 1)
          }
        }
      })
      this.$emit('select', this.aChangeData)
    },
    selectClear() {
      this.aChangeData = []
      this.$refs.elTable.clearSelection()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
