<template>
  <div class="app-container">
    <!-- 表格顶部功能框 -->
    <div class="filter-container">
      <!-- 功能框分为三部分 -->
      <div class="flex-box">
        <div>
          <el-button v-if="operability" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
            添加
          </el-button>
        </div>
        <div>
          <el-select v-model="checkedSearch" class="filter-item" style="width: 130px">
            <el-option v-for="item in searchOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
          <el-input v-model="searchKey" clearable placeholder="请输入关键字" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <div>
          <el-button v-waves :loading="downloadLoading" class="filter-item" type="info" icon="el-icon-download" @click="handleDownload">
            导出Excel
          </el-button>
        </div>
      </div>
    </div>
    <!-- 表格内容 -->
    <el-table
      ref="refTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" align="center" type="index" />
      <el-table-column label="标题" prop="title" align="center" min-width="280px">
        <template slot-scope="{row}">
          <span v-if="row.title" class="link-type">{{ row.title }}</span>
          <span v-else>起个标题</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛名称" width="180" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.match_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" min-width="220" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.match_project }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布人" min-width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="operability" label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除该数据吗？"
            @onConfirm="handleDelete(row,$index)"
          >
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total>0" class="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 编辑与新增弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 92%; margin-left:50px;">
        <el-form-item label="标题" prop="title" style="width: 70%;">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="竞赛名称" prop="match_name" style="width: 70%;">
          <el-input v-model="temp.match_name" />
        </el-form-item>
        <el-form-item label="项目名称" prop="match_project" style="width: 70%;">
          <el-input v-model="temp.match_project" />
        </el-form-item>
        <el-form-item label="日期" prop="time">
          <el-date-picker v-model="temp.time" type="datetime" placeholder="点击选择日期" />
        </el-form-item>
        <el-form-item label="发布人" prop="name" style="width: 70%;">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="摘要" prop="short_content" style="width: 80%;">
          <el-input v-model="temp.short_content" />
        </el-form-item>
        <el-form-item label="内容" prop="content" style="width: 100%;">
          <Tinymce ref="editor" v-model="temp.content" :height="400" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getNoticeList, addNotice, updataNotice, deleteNotice } from '@/api/Article/notice'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'Notice',
  components: { Pagination, Tinymce },
  directives: { waves },
  data() {
    return {
      // 搜索内容
      searchKey: '',
      checkedSearch: 'title',
      searchOptions: [
        { key: 'title', display_name: '标题' },
        { key: 'match_name', display_name: '竞赛名称' },
        { key: 'match_project', display_name: '项目名称' }
      ],
      tableKey: 0,
      list: null,
      // 总共内容数
      total: 0,
      listLoading: true, // 列表加载状态
      listQuery: {
        page: 1,
        limit: 20,
        start_date: '',
        end_date: '',
        match_project: '',
        match_name: '',
        title: ''
      },
      // 弹框内容
      temp: {
        id: undefined,
        title: '',
        match_name: '',
        time: new Date(),
        content: '',
        match_project: ''
      },
      // 弹出框是否显示
      dialogFormVisible: false,
      dialogStatus: '',
      flag: 1,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      // 弹框规则
      rules: {
        title: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        match_project: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        time: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        match_name: [{ required: true, message: '此项不能为空哦！', trigger: 'blur' }],
        name: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        content: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }],
        short_content: [{ required: true, message: '此项不能为空哦！', trigger: 'change' }]
      },
      // 下载excel
      downloadLoading: false
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
    // 网络请求获取表格数据
    getList() {
      getNoticeList(this.listQuery).then(response => {
        this.list = response.obj.noticeList
        this.total = response.obj.pageTotal
        this.listLoading = false
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery = {
        page: 1,
        limit: 20,
        start_date: '',
        end_date: '',
        match_project: '',
        match_name: '',
        title: ''
      }
      if (this.checkedSearch === 'title') {
        this.listQuery.title = this.searchKey
      } else if (this.checkedSearch === 'match_name') {
        this.listQuery.match_name = this.searchKey
      } else if (this.checkedSearch === 'match_project') {
        this.listQuery.match_project = this.searchKey
      }
      this.listQuery.page = 1
      this.getList()
    },
    // 新增弹框清空内容
    resetTemp() {
      this.temp = {
        id: undefined,
        title: '',
        match_name: '',
        time: new Date(),
        content: ''
      }
    },
    // 弹出新增框
    handleCreate() {
      this.resetTemp()
      if (this.flag !== 1) {
        this.$nextTick(() => {
          this.$refs.editor.setContent('')
        })
      }
      this.flag++
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.total = this.total + 1
          this.temp.id = this.total
          this.temp.time = parseTime(this.temp.time, '{y}-{m}-{d} {h}:{i}')
          addNotice(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 弹出编辑框
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.temp.timestamp = new Date(this.temp.time)
      if (this.flag !== 1) {
        this.$nextTick(() => {
          this.$refs.editor.setContent(this.temp.content)
        })
      }
      this.flag++
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updataNotice(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除操作
    handleDelete(row, index) {
      deleteNotice(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '成功删除',
          type: 'success',
          duration: 2000
        })
      })
      this.list.splice(index, 1)
    },
    // 下载excel
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '标题', '竞赛名称', '项目名称', '日期', '作者', '内容']
        const filterVal = ['id', 'title', 'match_name', 'match_project', 'time', 'name', 'content']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '竞赛通知'
        })
        this.downloadLoading = false
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
<style lang="scss" scoped>
  .flex-box {
    display: flex;
    justify-content: space-between;
  }
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
  /deep/ .el-dialog {
    width: 60%;
  }
</style>
