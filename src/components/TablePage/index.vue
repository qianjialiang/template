<template>
  <div>
    <div class="filter-container">
      <slot :search="fSearchDataList" :clear="fClearDataList" />
    </div>

    <div class="filter-container">
      <div class="filter-item fr">
        <slot name="btn" />
      </div>
    </div>

    <slot name="table" :list="oData.list" :indexMethod="indexMethod">
      <el-table
        :data="oData.list"
        border
        size="mini"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
          :index="indexMethod"
          width="60"
          align="center"
        />
        <slot name="main" />
      </el-table>
    </slot>

    <el-pagination
      :current-page.sync="oPageData.pageIndex"
      :page-sizes="[10, 20, 30, 50]"
      :page-size.sync="oPageData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="oData.count"
      background
      @size-change="fGetDataList"
      @current-change="fGetDataList"
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
    }
  },
  data() {
    return {
      oData: {
        list: [],
        count: 0
      },
      oPageData: {
        pageIndex: 1,
        pageSize: 10
      },
      oQueryData: null
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
  methods: {
    indexMethod(index) {
      return (this.oPageData.pageIndex - 1) * this.oPageData.pageSize + index + 1
    },
    fGetDataList() {
      const obj = {
        ...this.constData
      }
      obj.pageSize = this.oPageData.pageSize
      obj.pageIndex = (this.oPageData.pageIndex - 1)
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
      this.getFunction(obj).then(res => {
        if (this.loopData) {
          this.oData.list = res.data.map(row => {
            return this.loopData(row)
          })
        } else {
          this.oData.list = res.data
        }
        this.oData.count = parseInt(res.totalSize)
      }).catch(() => {
        this.oData.list = []
        this.oData.count = 0
      })
    },
    fSearchDataList() {
      this.oPageData.pageIndex = 1
      this.fGetDataList()
    },
    fClearDataList() {
      this.oPageData = {
        pageIndex: 1,
        pageSize: 10
      }
      const obj = {}
      for (const key in this.oQueryData) {
        obj[key] = ''
      }
      this.oQueryData = obj
      this.$emit('update:queryData', obj)
      this.$emit('fClearData')

      this.fGetDataList(true)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
