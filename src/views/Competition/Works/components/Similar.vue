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
      @selection-change="changesWorkId"
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" inline class="demo-table-expand">
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
      <el-table-column label="竞赛名称" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.match_name }}</span>
          <el-tag>{{ row.match_project }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="作品名称" align="center" min-width="200px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleWork(row.wid)">{{ row.worksname }}</span>
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="负责人姓名" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author1_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="指导老师" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teacher }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280px" class-name="small-padding">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="primary" @click="handleSimilar(row)">
            查看相似作品
          </el-button>
          <el-button type="primary" size="mini" @click="handleShenHe(row,$index)">
            审核
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleReturn(row,$index)">
            退回
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 弹出框 -->
    <el-dialog title="退回信息" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 95%; margin-left:25px;">
        <el-form-item label="邮件主题" prop="theme" style="width: 100%;">
          <el-input v-model="temp.theme" />
        </el-form-item>
        <el-form-item label="邮件内容" prop="content" style="width: 100%;">
          <Tinymce ref="editor" v-model="temp.content" :height="400" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="backData()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <!-- 弹出框 -->
    <el-dialog
      title="相似作品列表"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <div class="table-layout">
        <el-row>
          <el-col :span="5" class="table-cell-title">相似作品名称</el-col>
          <el-col :span="4" class="table-cell-title">负责人姓名</el-col>
          <el-col :span="5" class="table-cell-title">标题相似度</el-col>
          <el-col :span="5" class="table-cell-title">简介相似度</el-col>
          <el-col :span="5" class="table-cell-title">设计相似度</el-col>
        </el-row>
        <el-row>
          <el-col :span="5" class="table-cell">{{ similarWrokDel.worksName }}</el-col>
          <el-col :span="4" class="table-cell">{{ similarWrokDel.authorName }}</el-col>
          <el-col :span="5" class="table-cell">{{ similarWrokDel.title_similarity * 100 }}%</el-col>
          <el-col :span="5" class="table-cell">{{ similarWrokDel.introduct_similarity * 100 }}%</el-col>
          <el-col :span="5" class="table-cell">{{ similarWrokDel.design_similarity * 100 }}%</el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getWorks } from '@/api/Competition/works/index'
import { returnSimilar, passSimilar, getSimilarWorksMesByWid } from '@/api/Competition/works/similar'
import { getCourseWorkMes } from '@/api/Competition/course'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'Similar',
  directives: { waves },
  components: { Pagination, Tinymce },
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
        id: undefined,
        name: '',
        type: '',
        theme: '',
        content: ''
      },
      // 弹框规则
      rules: {
        theme: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        content: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }]
      },
      dialogFormVisible: false,
      dialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '作品详情'
      },
      downloadLoading: false,
      similarWrokDel: [],
      checkedWorks: [], // 多选框选中的作品
      workId: {
        wid: [],
        theme: '',
        content: ''
      } // 传给后台的作品ID数组
    }
  },
  computed: {
    ...mapGetters([
      'operability'
    ])
  },
  mounted() {
    this.getList()
  },
  methods: {
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
    // 搜索
    search(val) {
      this.listQuery = val
      this.getList()
    },
    // 将作品id传给父组件展示详情
    handleWork(wid) {
      this.$emit('handleWork', wid)
    },
    handleShenHe(row, index) {
      if (this.checkedWorks.length === 0) {
        passSimilar(row).then(() => {
          this.$notify({
            title: '成功',
            message: '成功审核',
            type: 'success',
            duration: 2000
          })
        })
      } else {
        this.checkedWorks.forEach(element => {
          this.workId.wid.push(element.wid)
        })
        this.workId.theme = this.temp.theme
        this.workId.content = this.temp.content
        passSimilar(this.workId).then(() => {
          this.$notify({
            title: '成功',
            message: '成功审核',
            type: 'success',
            duration: 2000
          })
        })
      }
      setTimeout(this.getList, 300)
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
    // 退回操作
    backData() {
      if (this.checkedWorks.length === 0) {
        returnSimilar(this.temp).then(() => {
          this.$notify({
            title: '成功',
            message: '成功退回并已发送邮箱提示',
            type: 'success',
            duration: 2000
          })
          this.dialogFormVisible = false
        })
      } else {
        this.checkedWorks.forEach(element => {
          this.workId.wid.push(element.wid)
        })
        this.workId.theme = this.temp.theme
        this.workId.content = this.temp.content
        returnSimilar(this.workId).then(() => {
          this.$notify({
            title: '成功',
            message: '成功退回并已发送邮箱提示',
            type: 'success',
            duration: 2000
          })
          this.dialogFormVisible = false
        })
      }
      setTimeout(this.getList, 300)
    },
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
    // 多选
    changesWorkId(val) {
      this.checkedWorks = val
    },
    // Excel格式化函数
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    // 弹出相似度窗口
    handleSimilar(row) {
      this.dialogVisible = true
      getSimilarWorksMesByWid(row.wid).then(res => {
        this.similarWrokDel = res.obj[0]
      })
    }
  }
}
</script>
<style scoped>
  .flex-box {
    display: flex;
    justify-content: space-between;
  }
</style>
<style lang="scss" scoped>
  .demo-table-expand .el-form-item {
    margin-left: 3%;
    margin-bottom: 0;
    width: 50%;
    /deep/ label {
      font-weight: normal;
      width: 90px;
      color: #99a9bf;
    }
  }
    .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }

  .mine-layout {
    position: absolute;
    right: 60px;
    top: 140px;
    width: 180px;
    height: 190px;
  }
</style>
