<template>
  <div>
    <!-- 表格内容 -->
    <el-table
      ref="refTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
      @row-click="clickTable"
      @selection-change="changesWorkId"
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="评委老师">
              <span v-for="(item,index) in row.judge" :key="index">{{ item.judge }}&nbsp;&nbsp;</span>
            </el-form-item>
            <el-form-item label="学号">
              <span>{{ row.number }}</span>
            </el-form-item>
            <el-form-item label="参赛邮箱">
              <span>{{ row.email }}</span>
            </el-form-item>
            <el-form-item label="参赛学校">
              <span>{{ row.school }}</span>
            </el-form-item>
            <el-form-item label="专业">
              <span>{{ row.major }}</span>
            </el-form-item>
            <el-form-item label="联系电话">
              <span>{{ row.phone }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="30px" />
      <el-table-column label="ID" width="55px" align="center" type="index" />
      <el-table-column label="竞赛名称" width="280px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.match_name }}</span>
          <el-tag>{{ row.match_project }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="作品名称" align="center" min-width="180px">
        <template slot-scope="{row}">
          <span class="link-type" @click.stop="handleWork(row.wid)">{{ row.worksname }}</span>
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author1_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指导老师" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teacher }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作" align="center">
        <template slot-scope="{row,$index}">
          <el-button v-if="operability || isCourseAdmin" type="primary" size="mini" @click="handleReturn(row, $index)">
            退回
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 弹出框 -->
    <el-dialog title="是否确认退回" :visible.sync="dialogFormVisible" width="30%">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="backData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { returnNoscored, returnCourse } from '@/api/Competition/works/noscored'
import { getWorks } from '@/api/Competition/works/index'
import { getCourseWorkMes } from '@/api/Competition/course'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'Noscored',
  directives: { waves },
  components: { Pagination },
  props: {
    listQuery: {
      default: () => {},
      type: Object
    },
    isCourseAdmin: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      temp: {
        wid: 0,
        theme: '',
        content: ''
      },
      downloadLoading: false,
      dialogFormVisible: false,
      // 弹框规则
      rules: {
        theme: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        content: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }]
      },
      checkedWorks: [], // 多选框选中的作品
      workId: [] // 传给后台的作品ID数组
    }
  },
  computed: {
    ...mapGetters([
      'operability'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    // 网络请求事件
    // 获取未分配数据
    getList(key = '', value = '') {
      if (key) {
        this.listQuery[key] = value
      }
      if (this.isCourseAdmin) {
        getCourseWorkMes(this.listQuery).then(response => {
          if (response.obj.worksList.length === 0) {
            this.$notify({
              title: '对不起！',
              message: '没有您想要的数据',
              type: 'warning',
              duration: 2000
            })
          }
          this.list = response.obj.worksList
          this.total = response.obj.pageTotal
          this.listLoading = false
        })
      } else {
        getWorks(this.listQuery).then(response => {
          if (response.obj.worksList.length === 0) {
            this.$notify({
              title: '对不起！',
              message: '没有您想要的数据',
              type: 'warning',
              duration: 2000
            })
          }
          this.list = response.obj.worksList
          this.total = response.obj.pageTotal
          this.listLoading = false
        })
      }
    },
    // 将作品id传给父组件展示详情
    handleWork(wid) {
      this.$emit('handleWork', wid)
    },
    // 退回弹出框
    handleReturn(row, index) {
      this.targetIndex = index
      this.temp = Object.assign({}, row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 多选
    changesWorkId(val) {
      this.checkedWorks = val
    },
    // 退回操作
    backData() {
      if (this.isCourseAdmin) {
        if (this.checkedWorks.length === 0) {
          returnCourse(this.temp.wid).then(() => {
            this.$notify({
              title: '成功',
              message: '成功退回',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
          })
        } else {
          this.checkedWorks.forEach(element => {
            this.workId.push(element.wid)
          })
          returnCourse(this.workId).then(() => {
            this.$notify({
              title: '成功',
              message: '成功退回',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
          })
        }
      } else {
        if (this.checkedWorks.length === 0) {
          returnNoscored(this.temp.wid).then(() => {
            this.$notify({
              title: '成功',
              message: '成功退回',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
          })
        } else {
          this.checkedWorks.forEach(element => {
            this.workId.push(element.wid)
          })
          returnNoscored(this.workId).then(() => {
            this.$notify({
              title: '成功',
              message: '成功退回',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
          })
        }
      }
      setTimeout(this.getList, 300)
    },
    // 下载excel
    handleDownload(header, filterVal) {
      import('@/vendor/Export2Excel').then(excel => {
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header,
          data,
          filename: '作品列表'
        })
      })
    },
    // Excel格式化函数
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    // 展开行，点击一行即可展开
    clickTable(row, index, e) {
      this.$refs.refTable.toggleRowExpansion(row)
    }
  }
}
</script>
